import {
  EmptyPcset,
  modes,
  get as pcset,
  Pcset,
  PcsetChroma,
  PcsetNum,
} from "@tonaljs/pcset";
import data, { FAMILIES } from "./data";

/**
 * Properties for a scale in the scale dictionary. It's a pitch class set
 * properties with the following additional information:
 * - name: the scale name
 * - aliases: alternative list of names
 * - intervals: an array of interval names
 * - family: the parent scale it's a mode of ("" if it's not a mode of one of
 *   tonal's families: major, melodic minor, harmonic minor, harmonic major,
 *   neapolitan major, neapolitan minor, double harmonic major and major
 *   pentatonic)
 * - degree: the degree of the parent scale the mode starts on, from 1 (0 if it
 *   has no family)
 */
export interface ScaleType extends Pcset {
  readonly name: string;
  readonly aliases: string[];
  readonly family: string;
  readonly degree: number;
}

export const NoScaleType: ScaleType = {
  ...EmptyPcset,
  intervals: [],
  aliases: [],
  family: "",
  degree: 0,
};

type Family = { family: string; degree: number };
const NoFamily: Family = { family: "", degree: 0 };
const families: Record<PcsetChroma, Family> = Object.create(null);
FAMILIES.forEach(([ivls, family]) => {
  modes(ivls.split(" ")).forEach((chroma, i) => {
    families[chroma] = { family, degree: i + 1 };
  });
});

type ScaleTypeName = string | PcsetChroma | PcsetNum;

let dictionary: ScaleType[] = [];
let index: Record<ScaleTypeName, ScaleType> = Object.create(null);

/**
 * Get the names of all the scale types in the dictionary, in the dictionary
 * order.
 *
 * @example
 * ScaleType.names().slice(0, 3); // => ["major pentatonic", "major", "minor"]
 */
export function names() {
  return dictionary.map((scale) => scale.name);
}

/**
 * Get a scale type (a scale without tonic) by its name, alias, chroma or set
 * number. It returns an empty scale type (`{ empty: true, ... }`) if it's not in
 * the dictionary. The type has `name`, `aliases` and `intervals`, and `family`
 * and `degree` when it's a mode of a parent scale like "harmonic major".
 * To get a scale with notes, use `Scale.get`.
 *
 * @param {string | number} type - scale type name or alias, pitch class set
 * chroma or set number
 * @example
 * ScaleType.get("major").name; // => "major"
 * ScaleType.get("ionian").name; // => "major"
 * ScaleType.get("dorian").intervals; // => ["1P", "2M", "3m", "4P", "5P", "6M", "7m"]
 * ScaleType.get("101010110101").name; // => "lydian"
 * ScaleType.get("dorian b5").family; // => "harmonic major"
 * ScaleType.get("dorian b5").degree; // => 2
 * ScaleType.get("nonsense").empty; // => true
 */
export function get(type: ScaleTypeName): ScaleType {
  return index[type] || NoScaleType;
}

/**
 * @deprecated Use ScaleType.get instead.
 */
export const scaleType = get;

/**
 * Get a copy of the list of all scale types in the dictionary.
 *
 * @example
 * ScaleType.all().length; // => 110
 * ScaleType.all()[0].name; // => "major pentatonic"
 */
export function all() {
  return dictionary.slice();
}

/**
 * @deprecated Use ScaleType.all instead.
 */
export const entries = all;

/**
 * Get every key that `ScaleType.get` accepts: names, aliases, chromas and set
 * numbers (as strings).
 *
 * @example
 * ScaleType.keys().slice(0, 3); // => ["2217", "2218", "2225"]
 */
export function keys() {
  return Object.keys(index);
}

/**
 * Remove every scale type from the dictionary, to define your own with
 * `ScaleType.add`. It changes the dictionary for the whole program.
 */
export function removeAll() {
  dictionary = [];
  index = Object.create(null);
}

/**
 * Add a scale type to the dictionary, so `ScaleType.get` and `Scale.get` know
 * it, and return it. It changes the dictionary for the whole program.
 *
 * @param intervals - the interval names, like `["1P", "2M", "3M"]`
 * @param name - the scale type name
 * @param aliases - other names for the scale type
 *
 * @example
 * ScaleType.add(["1P", "2M", "3M", "5P"], "my tetra", ["tetra"]).name; // => "my tetra"
 * Scale.get("C tetra").notes; // => ["C", "D", "E", "G"]
 */
export function add(
  intervals: string[],
  name: string,
  aliases: string[] = [],
): ScaleType {
  const set = pcset(intervals);
  const family = families[set.chroma] || NoFamily;
  const scale = { ...set, name, intervals, aliases, ...family };
  dictionary.push(scale);
  index[scale.name] = scale;
  index[scale.setNum] = scale;
  index[scale.chroma] = scale;
  scale.aliases.forEach((alias) => addAlias(scale, alias));
  return scale;
}

/**
 * Add an alias (another name) to a scale type of the dictionary, so
 * `ScaleType.get` and `Scale.get` accept it. It changes the dictionary for the
 * whole program.
 *
 * @param scale - a scale type, as returned by `ScaleType.get`
 * @param alias - the new name
 *
 * @example
 * ScaleType.addAlias(ScaleType.get("major"), "ionian mode");
 * Scale.get("C ionian mode").notes; // => ["C", "D", "E", "F", "G", "A", "B"]
 */
export function addAlias(scale: ScaleType, alias: string) {
  index[alias] = scale;
}

data.forEach(([ivls, name, ...aliases]: string[]) =>
  add(ivls.split(" "), name, aliases),
);

/** @deprecated */
export default {
  names,
  get,
  all,
  add,
  removeAll,
  keys,

  // deprecated
  entries,
  scaleType,
};
