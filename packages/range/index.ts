import { compact, range } from "@tonaljs/collection";
import { midiToNoteName, toMidi, ToNoteNameOptions } from "@tonaljs/midi";

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be connected to create complex ranges.
 *
 * @param {Array} array - the list of notes or numbers used
 * @return {Array} an array of numbers or empty array if not valid parameters
 *
 * @example
 * numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works midi notes
 * numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 */
export function numeric(notes: Array<string | number>): number[] {
  const midi: number[] = compact(notes.map(toMidi));
  if (!notes.length || midi.length !== notes.length) {
    // there is no valid notes
    return [];
  }

  return midi.reduce(
    (result, note) => {
      const last: number = result[result.length - 1];
      return result.concat(range(last, note).slice(1));
    },
    [midi[0]]
  );
}

/**
 * Create a range of chromatic notes. The altered notes will use flats.
 *
 * @function
 * @param {String|Array} list - the list of notes or midi note numbers
 * @return {Array} an array of note names
 *
 * @example
 * Range.chromatic("C2 E2 D2") // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
 * // with sharps
 * Range.chromatic("C2 C3", true) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
 */
export function chromatic(
  notes: Array<string | number>,
  options?: ToNoteNameOptions
): string[] {
  return numeric(notes).map(midi => midiToNoteName(midi, options));
}

export default { numeric, chromatic };
