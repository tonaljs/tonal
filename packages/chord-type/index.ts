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
 * Get a chord type (a chord without tonic) by its name, alias, chroma or set
 * number. It returns an empty chord type (`{ empty: true, ... }`) if it's not
 * in the dictionary. The type has `name`, `aliases`, `intervals`, `quality`
 * and `family`. To get a chord with notes, use `Chord.get`.
 *
 * @param {string | number} type - chord type name or alias, pitch class set
 * chroma or set number
 * @example
 * ChordType.get("major").name; // => "major"
 * ChordType.get("maj7").intervals; // => ["1P", "3M", "5P", "7M"]
 * ChordType.get("M").aliases; // => ["M", "^", "", "maj"]
 * ChordType.get("100010010000").name; // => "major"
 * ChordType.get("nonsense").empty; // => true
 */
export function get(type: ChordTypeName): ChordType {
  return index[type] || NoChordType;
}

/** @deprecated Use ChordType.get instead. */
export const chordType = get;

/**
 * Get the long names of all the chord types in the dictionary, in the
 * dictionary order. Types without long name are left out.
 *
 * @example
 * ChordType.names().slice(0, 4); // => ["fifth", "suspended fourth", "suspended fourth seventh", "augmented"]
 */
export function names() {
  return dictionary.map((chord) => chord.name).filter((x) => x);
}

/**
 * Get the main symbol (the first alias) of every chord type in the
 * dictionary, in the dictionary order.
 *
 * @example
 * ChordType.symbols().slice(0, 4); // => ["5", "M7#5sus4", "7#5sus4", "sus4"]
 */
export function symbols() {
  return dictionary.map((chord) => chord.aliases[0]).filter((x) => x);
}

/**
 * Get every key that `ChordType.get` accepts: names, aliases, chromas and set
 * numbers (as strings).
 *
 * @example
 * ChordType.keys().slice(0, 6); // => ["2", "4", "5", "6", "7", "9"]
 */
export function keys() {
  return Object.keys(index);
}

/**
 * Get a copy of the list of all chord types in the dictionary.
 *
 * @example
 * ChordType.all().length; // => 115
 * ChordType.all()[0].name; // => "fifth"
 */
export function all(): ChordType[] {
  return dictionary.slice();
}

/** @deprecated Use ChordType.all instead. */
export const entries = all;

/**
 * Remove every chord type from the dictionary, to define your own with
 * `ChordType.add`. It changes the dictionary for the whole program.
 */
export function removeAll() {
  dictionary = [];
  index = Object.create(null);
}

/**
 * Add a chord type to the dictionary, so `ChordType.get` and `Chord.get`
 * know it. It changes the dictionary for the whole program.
 *
 * @param intervals - the interval names, like `["1P", "3M", "5P"]`
 * @param aliases - the symbols for the chord type, the first is the main one
 * @param [fullName] - the long name of the chord type
 *
 * @example
 * ChordType.add(["1P", "5P", "7m"], ["7no3"], "dominant seventh no third");
 * Chord.get("C7no3").notes; // => ["C", "G", "Bb"]
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

/**
 * Add an alias (another symbol) to a chord type of the dictionary, so
 * `ChordType.get` and `Chord.get` accept it. It changes the dictionary for the
 * whole program.
 *
 * @param chord - a chord type, as returned by `ChordType.get`
 * @param alias - the new symbol
 *
 * @example
 * ChordType.addAlias(ChordType.get("maj7"), "Δ7");
 * Chord.get("CΔ7").notes; // => ["C", "E", "G", "B"]
 */
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
 * Get the family of a chord type from its interval names (`ChordType.get(name).family`
 * has it for listed types). It returns `""` for no intervals.
 *
 * The family is found from its intervals. It looks at the third, then
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
 * ChordType.family(["1P", "3M", "5P", "7m"]); // => "dominant"
 * ChordType.family(["1P", "4P", "5P", "7m"]); // => "suspended"
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
