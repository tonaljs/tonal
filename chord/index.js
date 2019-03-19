/**
 * `tonal/chord` is a collection of functions to manipulate musical chords
 *
 * ## Usage
 *
 * ```js
 * // ES6 modules (import)
 * import Chord from 'tonal/chord'
 * Chord.notes("CMaj7") // => ["C", "E", "G", "B"]
 *
 * // Tonal facade (require)
 * const Tonal = require('tonal')
 * Tonal.Chord.intervals('Cmaj7') // => ["1P", "3M", "5P", "7M"]
 * ```
 *
 * ## API
 *
 * @module Chord
 */
export default {
  tokenize,
  transpose,
  props,
  notes,
  intervals,
  exists,
  subsets,
  supersets
};

import { tokenize as split } from "../note";
import { transpose as tr } from "../distance";
import { all as chords, find as findChord } from "../chord-dictionary";
import { isSubsetOf, isSupersetOf } from "../pcset";

const chordName = chord => chord.abbreviatures[0];

// 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)
const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * Chord.tokenize("Cmaj7") // => [ "C", "maj7" ]
 * Chord.tokenize("C7") // => [ "C", "7" ]
 * Chord.tokenize("mMaj7") // => [ null, "mMaj7" ]
 * Chord.tokenize("Cnonsense") // => [ null, "nonsense" ]
 */
export function tokenize(name) {
  const p = split(name);
  if (p[0] === "") return [null, name];
  // aug is augmented (see https://github.com/danigb/tonal/issues/55)
  if (p[0] === "A" && p[3] === "ug") return [null, "aug"];

  if (NUM_TYPES.test(p[2])) {
    return [p[0] + p[1], p[2] + p[3]];
  } else {
    return [p[0] + p[1] + p[2], p[3]];
  }
}

/**
 * Transpose a chord name
 *
 * @param {string} name - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * Chord.transpose('Dm7', 'P4') // => 'Gm7
 */
export function transpose(name, interval) {
  const [tonic, type] = tokenize(name);
  if (!tonic) return name;
  return tr(tonic, interval) + type;
}

/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * Chord.names() // => ["maj7", ...]
 */
export const names = aliases => chords.map(chordName);

/**
 * Get chord properties. It returns an object with:
 *
 * - name: the chord name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the chord intervals
 * - chroma:  chord croma (see pcset)
 * - setnum: chord chroma number
 *
 * @function
 * @param {string} name - the chord name (without tonic)
 * @return {Object} an object with the properties or a object with all properties
 * set to null if not valid chord name
 */
export function props(chordName) {
  const [tonic, type] = tokenize(chordName);
  const chord = findChord(type);
  const props = {
    tonic,
    notes: tonic ? chord.intervals.map(tr(tonic)) : []
  };
  return Object.assign(props, chord);
}

/**
 * Get chord intervals. It always returns an array
 *
 * @function
 * @param {string} name - the chord name (optionally a tonic and type)
 * @return {Array<String>} a list of intervals or null if the type is not known
 */
export function intervals(name) {
  return props(name).intervals;
}

/**
 * Get the chord notes of a chord. This function accepts either a chord name
 * (for example: "Cmaj7") or a list of notes.
 *
 * It always returns an array, even if the chord is not found.
 *
 * @function
 * @param {string} nameOrTonic - name of the chord or the tonic (if the second parameter is present)
 * @param {string} [name] - (Optional) name if the first parameter is the tonic
 * @return {Array} an array of notes or an empty array
 *
 * @example
 * Chord.notes("Cmaj7") // => ["C", "E", "G", "B"]
 * Chord.notes("C", "maj7") // => ["C", "E", "G", "B"]
 */
export function notes(nameOrTonic, type) {
  if (type) return props(type).intervals.map(tr(nameOrTonic));
  return props(nameOrTonic).notes;
}

/**
 * Check if a given name correspond to a chord in the dictionary
 *
 * @function
 * @param {string} name
 * @return {Boolean}
 *
 * @example
 * Chord.exists("CMaj7") // => true
 * Chord.exists("Maj7") // => true
 * Chord.exists("Ablah") // => false
 */
export function exists(name) {
  return props(name).intervals.length > 0;
}

/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of chord names
 */
export function supersets(name) {
  const chordIntervals = intervals(name);
  if (chordIntervals.length === 0) return [];
  const isSuperset = isSupersetOf(chordIntervals);
  return chords()
    .filter(chord => isSuperset(chord.intervals))
    .map(chordName);
}

/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of chord names
 */
export function subsets(name) {
  const isSubset = isSubsetOf(intervals(name));
  return chords()
    .filter(chord => isSubset(chord.intervals))
    .map(chordName);
}
