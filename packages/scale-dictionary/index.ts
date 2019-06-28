import { IntervalName } from "@tonaljs/interval";
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
  readonly intervals: IntervalName[];
  readonly aliases: string[];
}

export const NoScaleType: ScaleType = {
  ...EmptyPcset,
  intervals: [],
  aliases: []
};

type ScaleTypeName = string | PcsetChroma | PcsetNum;

const scaleNames: string[] = [];
const scaleAliases: string[] = [];
const scaleTypes: Record<ScaleTypeName, ScaleType> = {};

/**
 * Given a scale name or chroma, return the scale properties
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { scale } from 'tonaljs/scale-dictionary'
 * scale('major')
 */
export function scaleType(type: ScaleTypeName): ScaleType {
  return scaleTypes[type] || NoScaleType;
}

/**
 * Get all scale names
 * @return {Array<String>} an array of scale names
 */
export function names() {
  return scaleNames.slice();
}

/**
 * Get all scale names
 * @return {Array<String>} an array of scale names
 */
export function aliases() {
  return scaleAliases.slice();
}

data.forEach(([ivls, name, ...aliases]) => {
  const intervals = ivls.split(" ");
  const set = pcset(intervals);
  if (set.chroma) {
    const scale: ScaleType = { ...set, name, intervals, aliases };
    scaleNames.push(name);
    scaleTypes[scale.num] = scale;
    scaleTypes[scale.name] = scale;
    scaleTypes[scale.chroma] = scale;
    aliases.forEach(alias => {
      scaleTypes[alias] = scale;
      scaleAliases.push(alias);
    });
  }
});
scaleNames.sort((a, b) => a.localeCompare(b));
scaleAliases.sort((a, b) => a.localeCompare(b));
