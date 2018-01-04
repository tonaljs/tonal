/**
 * A collection of functions to create note ranges.
 *
 * @example
 * const Range = require("tonal-range")
 * import * as Range from "tonal-range"
 *
 * @example
 * // ascending chromatic range
 * Range.chromatic(["C4", "E4"]) // => ["C4", "Db4", "D4", "Eb4", "E4"]
 * // descending chromatic range
 * Range.chromatic(["E4", "C4"]) // => ["E4", "Eb4", "D4", "Db4", "C4"]
 * // combining ascending and descending in complex ranges
 * Range.chromatic(["C2", "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
 * // numeric (midi note numbers) range
 * Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64]
 * // complex numeric range
 * Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 *
 * @module Range
 */
import { trFifths } from "tonal-distance";
import { midi, fromMidi } from "tonal-note";
import { range } from "tonal-array";
import { filter } from "tonal-pcset";

// convert notes to midi if needed
function asNum(n) {
  return typeof n === "number" ? n : midi(n);
}

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be conected to create complex ranges.
 *
 * @param {Array} array - the list of notes or numbers used
 * @return {Array} an array of numbers or empty array if not vald parameters
 *
 * @example
 * Range.numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works midi notes
 * Range.numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 * // can be expressed with a string or array
 */
export function numeric(arr) {
  return arr.map(asNum).reduce(function(r, n, i) {
    if (i === 1) return range(r, n);
    const last = r[r.length - 1];
    return r.concat(range(last, n).slice(1));
  });
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
export function chromatic(arr, sharps) {
  return numeric(arr).map(n => fromMidi(n, sharps));
}

/**
 * Create a range with a cycle of fifths
 * @function
 * @param {String|Pitch} tonic - the tonic note or pitch class
 * @param {Array|String} range - the range array
 * @return {Array} a range of cycle of fifths starting with the tonic
 * @example
 * Range.fifths("C", [0, 6]) // => [ "C", "G", "D", "A", "E", "B", "F#" ])
 */
export function fifths(tonic, range) {
  return numeric(range).map(trFifths(tonic));
}

/**
 * Create a scale (pitch class set) Range. Given a scale (a pitch class set)
 * and a range array, it returns a range in notes.
 *
 * Can be partially applied
 *
 * @function
 * @param {Array} scale - the scale to use or a function to
 * convert from midi numbers to note names
 * @param {Array} range - a list of notes or midi numbers
 * @return {Array} the scale range, an empty array if not valid source or
 * null if not valid start or end
 *
 * @example
 * Range.scale("C D E F G A B", ["C3", "C2"])
 * // => [ "C3", "B2", "A2", "G2", "F2", "E2", "D2", "C2" ]
 * const majorC = Range.scale("C D E F G A B")
 * majorC(["C3", "C2"]) * // => [ "C3", "B2", "A2", "G2", "F2", "E2", "D2", "C2" ]
 */
export function scale(set, range) {
  return arguments.length === 1
    ? r => scale(set, r)
    : filter(set, chromatic(range));
}
