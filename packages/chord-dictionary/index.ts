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
const chordNames: string[] = [];
const chordAliases: string[] = [];
const chordTypes: Record<ChordTypeName, ChordType> = {};

/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { chord } from 'tonaljs/chord-dictionary'
 * chord('major')
 */
export function chordType(type: ChordTypeName): ChordType {
  return chordTypes[type] || NoChordType;
}

/**
 * Get all chord names
 * @return {Array<String>} an array of chord names
 */
export function names() {
  return chordNames.slice();
}

export function abbreviatures() {
  return chordAliases.slice();
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

// build index and name lists
data.forEach(([ivls, name, abbrvs]) => {
  const intervals = ivls.split(" ");
  const aliases = abbrvs.split(" ");
  const quality = getQuality(intervals);
  const set = pcset(intervals);
  if (set.chroma) {
    const chord: ChordType = { ...set, name, quality, intervals, aliases };
    if (name) {
      chordNames.push(name);
      chordTypes[name] = chord;
    }
    chordTypes[chord.setNum] = chord;
    chordTypes[chord.chroma] = chord;
    aliases.forEach(alias => {
      chordAliases.push(alias);
      chordTypes[alias] = chord;
    });
  }
});
chordNames.sort((a, b) => a.localeCompare(b));
chordAliases.sort((a, b) => a.localeCompare(b));
