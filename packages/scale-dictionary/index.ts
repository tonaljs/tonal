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

const scales: ScaleType[] = data.map(dataToScaleType);
const index: Record<ScaleTypeName, ScaleType> = scales.reduce(
  (index: Record<ScaleTypeName, ScaleType>, scale) => {
    index[scale.name] = scale;
    index[scale.setNum] = scale;
    index[scale.chroma] = scale;
    scale.aliases.forEach(alias => {
      index[alias] = scale;
    });
    return index;
  },
  {}
);
const ks = Object.keys(index);

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

export function keys() {
  return ks.slice();
}

function dataToScaleType([ivls, name, ...aliases]: string[]): ScaleType {
  const intervals = ivls.split(" ");
  return { ...pcset(intervals), name, intervals, aliases };
}
