import { coordToNote, note, NoteName } from "tonal";
export {
  Note,
  NoteName,
  note,
  tokenizeNote as tokenize,
  altToAcc
} from "tonal";

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
  return n.valid ? coordToNote([n.coord[0] + fifths]).name : "";
}
