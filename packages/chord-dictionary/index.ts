import {
  EmptyPcset,
  Pcset,
  pcset,
  PcsetChroma,
  PcsetNum
} from "@tonaljs/pcset";
import data from "./data";

export type ChordQuality =
  | "Major"
  | "Minor"
  | "Augmented"
  | "Diminished"
  | "Unknown";

export interface ChordType extends Pcset {
  name: string;
  quality: ChordQuality;
  aliases: string[];
}
const NoChordType: ChordType = {
  ...EmptyPcset,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
};

type ChordTypeName = string | PcsetChroma | PcsetNum;
const chords: ChordType[] = data.map(dataToChordType);
chords.sort((a, b) => a.setNum - b.setNum);
const index: Record<ChordTypeName, ChordType> = chords.reduce(
  (index: Record<ChordTypeName, ChordType>, chord) => {
    if (chord.name) {
      index[chord.name] = chord;
    }
    index[chord.setNum] = chord;
    index[chord.chroma] = chord;
    chord.aliases.forEach(alias => {
      index[alias] = chord;
    });
    return index;
  },
  {}
);

/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { chord } from 'tonaljs/chord-dictionary'
 * chord('major')
 */
export function chordType(type: ChordTypeName): ChordType {
  return index[type] || NoChordType;
}

/**
 * Return a list of all chord types
 */
export function entries(): ChordType[] {
  return chords.slice();
}

function getQuality(intervals: string[]): ChordQuality {
  const has = (interval: string) => intervals.indexOf(interval) !== -1;
  return has("5A")
    ? "Augmented"
    : has("3M")
    ? "Major"
    : has("5d")
    ? "Diminished"
    : has("3m")
    ? "Minor"
    : "Unknown";
}

function dataToChordType([ivls, name, abbrvs]: string[]) {
  const intervals = ivls.split(" ");
  const aliases = abbrvs.split(" ");
  const quality = getQuality(intervals);
  const set = pcset(intervals);
  return { ...set, name, quality, intervals, aliases };
}
