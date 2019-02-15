/**
 * [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
 * [![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-chord` is a collection of functions to manipulate musical chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Chord from "tonal-chord"
 * // es5
 * const Chord = require("tonal-chord")
 *
 * @example
 * Chord.notes("CMaj7") // => ["C", "E", "G", "B"]
 *
 * @module Chord
 */
import { tokenize as split } from "tonal-note";
import { transpose } from "tonal-distance";
import { chord } from "tonal-dictionary";
import { chroma, isSubsetOf, isSupersetOf } from "tonal-pcset";

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
export const names = chord.names;

const NO_CHORD = Object.freeze({
  name: null,
  names: [],
  intervals: [],
  chroma: null,
  setnum: null
});

const properties = name => {
  const intervals = chord(name);
  if (!intervals) return NO_CHORD;
  const s = { intervals, name };
  s.chroma = chroma(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = chord.names(s.chroma);
  return s;
};

const memo = (fn, cache = {}) => str => cache[str] || (cache[str] = fn(str));

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
export const props = memo(properties);

/**
 * Get chord intervals. It always returns an array
 *
 * @function
 * @param {string} name - the chord name (optionally a tonic and type)
 * @return {Array<String>} a list of intervals or null if the type is not known
 */
export const intervals = name => props(tokenize(name)[1]).intervals;

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
export function notes(nameOrTonic, name) {
  if (name) return props(name).intervals.map(transpose(nameOrTonic));
  const [tonic, type] = tokenize(nameOrTonic);
  return props(type).intervals.map(transpose(tonic));
}

/**
 * Check if a given name correspond to a chord in the dictionary
 *
 * @function
 * @param {string} name
 * @return {Boolean}
 * @example
 * Chord.exists("CMaj7") // => true
 * Chord.exists("Maj7") // => true
 * Chord.exists("Ablah") // => false
 */
export const exists = name => chord(tokenize(name)[1]) !== undefined;

/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of chord names
 */
export const supersets = name => {
  if (!intervals(name).length) return [];
  const isSuperset = isSupersetOf(intervals(name));
  return chord.names().filter(name => isSuperset(chord(name)));
};

/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of chord names
 */
export const subsets = name => {
  const isSubset = isSubsetOf(intervals(name));
  return chord.names().filter(name => isSubset(chord(name)));
};

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
 * Chord.tokenize("mMaj7") // => [ "", "mMaj7" ]
 * Chord.tokenize("Cnonsense") // => [ "C", "nonsense" ]
 */
export function tokenize(name) {
  const p = split(name);
  if (p[0] === "") return ["", name];
  // aug is augmented (see https://github.com/danigb/tonal/issues/55)
  if (p[0] === "A" && p[3] === "ug") return ["", "aug"];

  if (NUM_TYPES.test(p[2])) {
    return [p[0] + p[1], p[2] + p[3]];
  } else {
    return [p[0] + p[1] + p[2], p[3]];
  }
}
