import { compact, range } from "@tonaljs/collection";
import { midiToNoteName, toMidi, ToNoteNameOptions } from "@tonaljs/midi";

/**
 * Create a list of midi numbers connecting the given notes (names or midi
 * numbers), going up or down between each pair. It returns [] if the list is
 * empty or any item is not valid.
 *
 * @param {Array} notes - the list of notes or midi numbers used
 * @return {Array} an array of numbers or empty array if not valid parameters
 *
 * @example
 * Range.numeric(["C4", "E4"]) // => [60, 61, 62, 63, 64]
 * Range.numeric(["C5", "C4"]).length // => 13
 * Range.numeric([10, 5]) // => [10, 9, 8, 7, 6, 5]
 * Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 * Range.numeric(["x"]) // => []
 */
export function numeric(notes: (string | number)[]): number[] {
  const midi: number[] = compact(
    notes.map((note) =>
      typeof note === "number" ? (isFinite(note) ? note : null) : toMidi(note),
    ),
  );
  if (!notes.length || midi.length !== notes.length) {
    // there is no valid notes
    return [];
  }

  return midi.reduce(
    (result, note) => {
      const last: number = result[result.length - 1];
      return result.concat(range(last, note).slice(1));
    },
    [midi[0]],
  );
}

/**
 * Create a list of note names connecting the given notes (names or midi
 * numbers) chromatically, going up or down between each pair. Altered notes
 * use flats unless `sharps: true`. It returns [] if the list is empty or any
 * item is not valid.
 *
 * @function
 * @param {Array} notes - the list of notes or midi note numbers to create a range from
 * @param {Object} options - The same as `midiToNoteName` (`{ sharps: boolean, pitchClass: boolean }`)
 * @return {Array} an array of note names
 *
 * @example
 * Range.chromatic(["C2", "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
 * // with sharps
 * Range.chromatic(["C2", "E2"], { sharps: true }) // => ["C2", "C#2", "D2", "D#2", "E2"]
 * Range.chromatic(["C4", "E4"], { pitchClass: true }) // => ["C", "Db", "D", "Eb", "E"]
 */
export function chromatic(
  notes: (string | number)[],
  options?: ToNoteNameOptions,
): string[] {
  return numeric(notes).map((midi) => midiToNoteName(midi, options));
}

/** @deprecated */
export default { numeric, chromatic };
