import { deprecate } from "@tonaljs/core";
import {
  EmptyPcset,
  get as pcset,
  Pcset,
  PcsetChroma,
  PcsetNum
} from "@tonaljs/pcset";
import data from "./data";

/**
 * Properties for a scale in the scale dictionary. It's a pitch class set
 * properties with the following additional information:
 * - name: the scale name
 * - aliases: alternative list of names
 * - intervals: an array of interval names
 */
export interface ScaleType extends Pcset {
  readonly name: string;
  readonly aliases: string[];
}

export const NoScaleType: ScaleType = {
  ...EmptyPcset,
  intervals: [],
  aliases: []
};

type ScaleTypeName = string | PcsetChroma | PcsetNum;

let dictionary: ScaleType[] = [];
let index: Record<ScaleTypeName, ScaleType> = {};

export function names() {
  return dictionary.map(scale => scale.name);
}

/**
 * Given a scale name or chroma, return the scale properties
 *
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/scale-type'
 * get('major') // => { name: 'major', ... }
 */
export function get(type: ScaleTypeName): ScaleType {
  return index[type] || NoScaleType;
}

export const scaleType = deprecate(
  "ScaleDictionary.scaleType",
  "ScaleType.get",
  get
);

/**
 * Return a list of all scale types
 */
export function all() {
  return dictionary.slice();
}

export const entries = deprecate(
  "ScaleDictionary.entries",
  "ScaleType.all",
  all
);

/**
 * Keys used to reference scale types
 */
export function keys() {
  return Object.keys(index);
}

/**
 * Clear the dictionary
 */
export function removeAll() {
  dictionary = [];
  index = {};
}

/**
 * Add a scale into dictionary
 * @param intervals
 * @param name
 * @param aliases
 */
export function add(
  intervals: string[],
  name: string,
  aliases: string[] = []
): ScaleType {
  const scale = { ...pcset(intervals), name, intervals, aliases };
  dictionary.push(scale);
  index[scale.name] = scale;
  index[scale.setNum] = scale;
  index[scale.chroma] = scale;
  scale.aliases.forEach(alias => addAlias(scale, alias));
  return scale;
}

export function addAlias(scale: ScaleType, alias: string) {
  index[alias] = scale;
}

data.forEach(([ivls, name, ...aliases]: string[]) =>
  add(ivls.split(" "), name, aliases)
);

export default {
  names,
  get,
  all,
  add,
  removeAll,
  keys,

  // deprecated
  entries,
  scaleType
};
