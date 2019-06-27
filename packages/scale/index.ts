import { scaleType, ScaleType } from "@tonaljs/scale-dictionary";
import { note, NoteName, transpose } from "@tonaljs/tonal";
export { names, aliases } from "@tonaljs/scale-dictionary";

type ScaleName = string;
type ScaleNameTokens = [string, string]; // [TONIC, SCALE TYPE]

interface Scale extends ScaleType {
  tonic: string | null;
  notes: NoteName[];
}

const NoScale: Scale = {
  name: "",
  tonic: null,
  num: NaN,
  chroma: "",
  normalized: "",
  length: 0,
  aliases: [],
  notes: [],
  intervals: []
};

const names = (array: string[]): string[] => array.filter((x: string) => x);

/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * Scale.tokenize("C mixolydean") // => ["C", "mixolydean"]
 * Scale.tokenize("anything is valid") // => ["", "anything is valid"]
 * Scale.tokenize() // => ["", ""]
 */
export function tokenize(name: ScaleName): ScaleNameTokens {
  if (typeof name !== "string") {
    return ["", ""];
  }
  const i = name.indexOf(" ");
  const tonic = note(name.substring(0, i));
  if (!tonic.valid) {
    const n = note(name);
    return n.valid ? [n.name, ""] : ["", name];
  }

  const type = name.substring(tonic.name.length + 1);
  return [tonic.name, type.length ? type : ""];
}

export function scale(name: ScaleName | ScaleNameTokens, type?: string): Scale {
  const [tonic, t] = Array.isArray(name) ? name : tokenize(name);
  type = type || t;
  const set = scaleType(type);
  if (!set) {
    return NoScale;
  }

  const notes: string[] = tonic
    ? names(set.intervals.map(i => transpose(tonic, i) as string))
    : [];

  return { tonic, notes, ...set };
}

/**
 * Check if the given name is a known scale from the scales dictionary
 *
 * @function
 * @param {string} name - the scale name
 * @return {Boolean}
 */
export function isKnown(name: ScaleName): boolean {
  const [tonic, type] = tokenize(name);
  return !!scale(type).name;
}

/**
 * @deprecated
 */
export const exists = isKnown;
