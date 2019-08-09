import {
  coordToNote,
  IntervalName,
  note,
  NoteName,
  Pitch,
  transpose
} from "@tonaljs/tonal";
export { tokenizeNote as tokenize } from "@tonaljs/tonal";
import { midiToNoteName } from "@tonaljs/midi";

const toNoteName = (sameAccidentals: boolean) => (
  noteName: NoteName | Pitch
): string => {
  const n = note(noteName);
  if (n.empty) {
    return "";
  }
  const sharps = sameAccidentals ? n.alt > 0 : n.alt < 0;
  const pitchClass = n.midi === null;
  return midiToNoteName(n.midi || n.chroma, { sharps, pitchClass });
};

/**
 * Simplify a note
 *
 * @function
 * @param {string} note - the note to be simplified
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplfied note or '' if not valid note
 * @example
 * simplify("C##") // => "D"
 * simplify("C###") // => "D#"
 * simplify("C###")
 * simplify("B#4") // => "C5"
 */
export const simplify = toNoteName(true);

/**
 * Get enharmonic of a note
 *
 * @function
 * @param {string} note
 * @return {string} the enhramonic note or '' if not valid note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enhramonic("C") // => "C"
 */
export const enharmonic = toNoteName(false);

/**
 * Transpose by an interval
 * @function
 * @param {string} interval
 * @return {function} a function that transposes by the given interval
 * @example
 * ["C", "D", "E"].map(transposeBy("5P"));
 * // => ["G", "A", "B"]
 */
export const transposeBy = (interval: IntervalName) => (note: NoteName) =>
  transpose(note, interval);

/**
 * Transpose from a note
 * @function
 * @param {string} note
 * @return {function}  a function that transposes the the note by an interval
 * ["1P", "3M", "5P"].map(transposeFrom("C"));
 * // => ["C", "E", "G"]
 */
export const transposeFrom = (note: NoteName) => (interval: IntervalName) =>
  transpose(note, interval);

/**
 * Transpose a note by a number of perfect fifths.
 *
 * @function
 * @param {string} note - the note name
 * @param {number} fifhts - the number of fifths
 * @return {string} the transposed note name
 *
 * @example
 * import { transposeFifths } from "@tonaljs/note"
 * transposeFifths("G4", 1) // => "D"
 * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */
export function transposeFifths(noteName: NoteName, fifths: number): NoteName {
  const n = note(noteName);
  if (n.empty) {
    return "";
  }
  const [nFifths, nOcts] = n.coord;
  const transposed =
    nOcts === undefined
      ? coordToNote([nFifths + fifths])
      : coordToNote([nFifths + fifths, nOcts]);

  return transposed.name;
}
