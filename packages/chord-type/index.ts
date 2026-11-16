import {
  EmptyPcset,
  get as pcset,
  Pcset,
  PcsetChroma,
  PcsetNum,
} from "@tonaljs/pcset";
import data from "./data";

export type ChordQuality =
  "Major" | "Minor" | "Augmented" | "Diminished" | "Unknown";

/**
 * A coarse classification of chord types, for choices that depend on the kind
 * of chord (a bass line or a comping pattern). It's empty for an empty type.
 */
export type ChordFamily =
  | "major"
  | "minor"
  | "dominant"
  | "half-diminished"
  | "diminished"
  | "augmented"
  | "suspended"
  | "power"
  | "";

export interface ChordType extends Pcset {
  name: string;
  quality: ChordQuality;
  family: ChordFamily;
  aliases: string[];
}
const NoChordType: ChordType = {
  ...EmptyPcset,
  name: "",
  quality: "Unknown",
  family: "",
  intervals: [],
  aliases: [],
};

type ChordTypeName = string | PcsetChroma | PcsetNum;

let dictionary: ChordType[] = [];
let index: Record<ChordTypeName, ChordType> = Object.create(null);

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

/** @deprecated */
export const chordType = get;

/**
 * Get all chord (long) names
 */
export function names() {
  return dictionary.map((chord) => chord.name).filter((x) => x);
}

/**
 * Get all chord symbols
 */
export function symbols() {
  return dictionary.map((chord) => chord.aliases[0]).filter((x) => x);
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

/** @deprecated */
export const entries = all;

/**
 * Clear the dictionary
 */
export function removeAll() {
  dictionary = [];
  index = Object.create(null);
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
    family: family(intervals),
    intervals,
    aliases,
  };
  dictionary.push(chord);
  if (chord.name) {
    index[chord.name] = chord;
  }
  index[chord.setNum] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach((alias) => addAlias(chord, alias));
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

/**
 * Get the family of a chord from its intervals. It looks at the third, then
 * the fifth and the seventh:
 *
 * - a major third and a minor seventh is "dominant", whatever the fifth
 * - a major third and an augmented fifth (without minor seventh) is "augmented"
 * - any other major third is "major"
 * - a minor third and a diminished fifth is "half-diminished" with a minor
 *   seventh, and "diminished" otherwise
 * - any other minor third is "minor"
 * - without third, a second or a fourth is "suspended"
 * - without third nor second or fourth, the seventh decides ("dominant" or
 *   "major"), then the fifth ("diminished" or "augmented"), and otherwise
 *   it's "power"
 *
 * @example
 * family(["1P", "3M", "5P", "7m"]) // => "dominant"
 * family(["1P", "4P", "5P", "7m"]) // => "suspended"
 */
export function family(intervals: string[]): ChordFamily {
  if (!intervals.length) return "";
  const find = (...nums: number[]) =>
    intervals.find((ivl) => nums.includes(parseInt(ivl, 10)));
  const third = find(3, 10)?.slice(-1);
  const fifth = find(5)?.slice(-1);
  const seventh = find(7)?.slice(-1);
  if (third === "M") {
    return seventh === "m" ? "dominant" : fifth === "A" ? "augmented" : "major";
  }
  if (third === "m") {
    return fifth !== "d"
      ? "minor"
      : seventh === "m"
        ? "half-diminished"
        : "diminished";
  }
  if (find(2, 4, 11)) return "suspended";
  if (seventh === "m") return "dominant";
  if (seventh === "M") return "major";
  if (fifth === "d") return "diminished";
  if (fifth === "A") return "augmented";
  return "power";
}

data.forEach(([ivls, fullName, names]: string[]) =>
  add(ivls.split(" "), names.split(" "), fullName),
);
dictionary.sort((a, b) => a.setNum - b.setNum);

/** @deprecated */
export default {
  names,
  symbols,
  get,
  all,
  add,
  family,
  removeAll,
  keys,
  // deprecated
  entries,
  chordType,
};
