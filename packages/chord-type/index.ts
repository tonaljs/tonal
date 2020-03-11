import { deprecate } from "@tonaljs/core";
import {
  EmptyPcset,
  get as pcset,
  Pcset,
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

let dictionary: ChordType[] = [];
let index: Record<ChordTypeName, ChordType> = {};

/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/chord-type'
 * get('major') // => { name: 'major', ... }
 */
export function get(type: ChordTypeName): ChordType {
  return index[type] || NoChordType;
}

export const chordType = deprecate("ChordType.chordType", "ChordType.get", get);

/**
 * Get all chord (long) names
 */
export function names() {
  return dictionary.map(chord => chord.name).filter(x => x);
}

/**
 * Get all chord symbols
 */
export function symbols() {
  return dictionary.map(chord => chord.aliases[0]).filter(x => x);
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
export function all(): ChordType[] {
  return dictionary.slice();
}

export const entries = deprecate("ChordType.entries", "ChordType.all", all);

/**
 * Clear the dictionary
 */
export function removeAll() {
  dictionary = [];
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
  dictionary.push(chord);
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
dictionary.sort((a, b) => a.setNum - b.setNum);

export default {
  names,
  symbols,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  chordType
};
