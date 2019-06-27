import { IntervalName } from "tonal-interval";
import { EmptySet, pcset, Pcset, PcsetChroma, PcsetNum } from "tonal-pcset";
import data from "./data";

/**
 * Properties for a scale in the scale dictionary. It's a pitch class set
 * properties with the following additional information:
 * - name: the scale name
 * - aliases: alternative list of names
 * - intervals: an array of interval names
 */
export interface ScalePcset extends Pcset {
  readonly name: string;
  readonly intervals: IntervalName[];
  readonly aliases: string[];
}

export const NoScalePcset: ScalePcset = {
  ...EmptySet,
  name: "",
  intervals: [],
  aliases: []
};

type ScaleType = string | PcsetChroma | PcsetNum;

const scaleNames: string[] = [];
const scaleAliases: string[] = [];
const scales: Record<ScaleType, ScalePcset> = {};

/**
 * Given a scale name or chroma, return the scale properties
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { scale } from 'tonaljs/scale-dictionary'
 * scale('major')
 */
export function scale(type: ScaleType): ScalePcset {
  return scales[type] || NoScalePcset;
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
    const scale: ScalePcset = Object.assign({ name, intervals, aliases }, set);
    scaleNames.push(name);
    scales[scale.num] = scale;
    scales[scale.name] = scale;
    scales[scale.chroma] = scale;
    aliases.forEach(alias => {
      scales[alias] = scale;
      scaleAliases.push(alias);
    });
  }
});
scaleNames.sort((a, b) => a.localeCompare(b));
scaleAliases.sort((a, b) => a.localeCompare(b));
