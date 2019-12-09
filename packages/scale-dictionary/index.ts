import {
  EmptyPcset,
  pcset,
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

let scales: ScaleType[] = [];
let index: Record<ScaleTypeName, ScaleType> = {};

/**
 * Given a scale name or chroma, return the scale properties
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { scale } from 'tonaljs/scale-dictionary'
 * scale('major')
 */
export function scaleType(type: ScaleTypeName): ScaleType {
  return index[type] || NoScaleType;
}

/**
 * Return a list of all scale types
 */
export function entries() {
  return scales.slice();
}

/**
 * Keys used to reference scale types
 */
export function keys() {
  return Object.keys(index);
}

/**
 * Clear the dictionary
 */
export function clear() {
  scales = [];
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
  scales.push(scale);
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
