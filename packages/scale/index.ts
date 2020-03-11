/**
 * References:
 * - https://www.researchgate.net/publication/327567188_An_Algorithm_for_Spelling_the_Pitches_of_Any_Musical_Scale
 * @module scale
 */
import { all as chordTypes } from "@tonaljs/chord-type";
import { rotate } from "@tonaljs/collection";
import { deprecate, note, NoteName, transpose } from "@tonaljs/core";
import { sortedUniqNames } from "@tonaljs/note";
import { isSubsetOf, isSupersetOf, modes } from "@tonaljs/pcset";
import {
  all as scaleTypes,
  get as getScaleType,
  names as scaleTypeNames,
  ScaleType
} from "@tonaljs/scale-type";

type ScaleName = string;
type ScaleNameTokens = [string, string]; // [TONIC, SCALE TYPE]

export interface Scale extends ScaleType {
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
 * tokenize("C mixolydean") // => ["C", "mixolydean"]
 * tokenize("anything is valid") // => ["", "anything is valid"]
 * tokenize() // => ["", ""]
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

/**
 * Get all scale names
 * @function
 */
export const names = scaleTypeNames;

/**
 * Get a Scale from a scale name.
 */
export function get(src: ScaleName | ScaleNameTokens): Scale {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = note(tokens[0]).name;
  const st = getScaleType(tokens[1]);
  if (st.empty) {
    return NoScale;
  }

  const type = st.name;
  const notes: string[] = tonic
    ? st.intervals.map(i => transpose(tonic, i))
    : [];

  const name = tonic ? tonic + " " + type : type;

  return { ...st, name, type, tonic, notes };
}

export const scale = deprecate("Scale.scale", "Scale.get", get);

/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord names
 *
 * @example
 * scaleChords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
 */
export function scaleChords(name: string): string[] {
  const s = get(name);
  const inScale = isSubsetOf(s.chroma);
  return chordTypes()
    .filter(chord => inScale(chord.chroma))
    .map(chord => chord.aliases[0]);
}
/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 * @example
 * extended("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
 */
export function extended(name: string): string[] {
  const s = get(name);
  const isSuperset = isSupersetOf(s.chroma);
  return scaleTypes()
    .filter(scale => isSuperset(scale.chroma))
    .map(scale => scale.name);
}

/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 *
 * @example
 * reduced("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
 */
export function reduced(name: string): string[] {
  const isSubset = isSubsetOf(get(name).chroma);
  return scaleTypes()
    .filter(scale => isSubset(scale.chroma))
    .map(scale => scale.name);
}

/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {string[]} notes
 * @return {string[]} pitch classes with same tonic
 * @example
 * scaleNotes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * scaleNotes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */
export function scaleNotes(notes: NoteName[]) {
  const pcset: string[] = notes.map(n => note(n).pc).filter(x => x);
  const tonic = pcset[0];
  const scale = sortedUniqNames(pcset);
  return rotate(scale.indexOf(tonic), scale);
}

type ScaleMode = [string, string];
/**
 * Find mode names of a scale
 *
 * @function
 * @param {string} name - scale name
 * @example
 * modeNames("C pentatonic") // => [
 *   ["C", "major pentatonic"],
 *   ["D", "egyptian"],
 *   ["E", "malkos raga"],
 *   ["G", "ritusen"],
 *   ["A", "minor pentatonic"]
 * ]
 */
export function modeNames(name: string): ScaleMode[] {
  const s = get(name);
  if (s.empty) {
    return [];
  }

  const tonics = s.tonic ? s.notes : s.intervals;
  return modes(s.chroma)
    .map(
      (chroma: string, i: number): ScaleMode => {
        const modeName = get(chroma).name;
        return modeName ? [tonics[i], modeName] : ["", ""];
      }
    )
    .filter(x => x[0]);
}

export default {
  get,
  names,
  extended,
  modeNames,
  reduced,
  scaleChords,
  scaleNotes,
  tokenize,
  // deprecated
  scale
};
