import { scaleType, ScaleType } from "@tonaljs/scale-dictionary";
import { note, NoteName, transpose } from "@tonaljs/tonal";
export { names, aliases } from "@tonaljs/scale-dictionary";

type ScaleName = string;
type ScaleNameTokens = [string, string]; // [TONIC, SCALE TYPE]

interface Scale extends ScaleType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
}

const NoScale: Scale = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
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
  if (tonic.empty) {
    const n = note(name);
    return n.empty ? ["", name] : [n.name, ""];
  }

  const type = name.substring(tonic.name.length + 1);
  return [tonic.name, type.length ? type : ""];
}

export function scale(src: ScaleName | ScaleNameTokens, type?: string): Scale {
  const [tonic, t] = Array.isArray(src) ? src : tokenize(src);
  type = type || t;
  const set = scaleType(type);
  if (set.empty) {
    return NoScale;
  }

  const notes: string[] = tonic
    ? names(set.intervals.map(i => transpose(tonic, i) as string))
    : [];

  const name = tonic ? tonic + " " + type : type;

  return { ...set, name, type: set.name, tonic, notes };
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
