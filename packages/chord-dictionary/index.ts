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

let chords: ChordType[] = [];
let index: Record<ChordTypeName, ChordType> = {};

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
 * Keys used to reference chord types
 */
export function keys() {
  return Object.keys(index);
}

/**
 * Return a list of all chord types
 */
export function entries(): ChordType[] {
  return chords.slice();
}

/**
 * Clear the dictionary
 */
export function clear() {
  chords = [];
  index = {};
}

/**
 * Add a chord to the dictionary.
 * @param intervals
 * @param aliases
 * @param [fullName]
 */
export function add(intervals: string[], aliases: string[], fullName?: string) {
  const quality = getQuality(intervals);
  const chord = {
    ...pcset(intervals),
    name: fullName || "",
    quality,
    intervals,
    aliases
  };
  chords.push(chord);
  if (chord.name) {
    index[chord.name] = chord;
  }
  index[chord.setNum] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach(alias => addAlias(chord, alias));
}

export function addAlias(chord: ChordType, alias: string) {
  index[alias] = chord;
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

data.forEach(([ivls, fullName, names]: string[]) =>
  add(ivls.split(" "), names.split(" "), fullName)
);
chords.sort((a, b) => a.setNum - b.setNum);
