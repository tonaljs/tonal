import { chroma as noteChroma } from "../note";
import { chroma as ivlChroma } from "../interval";
import { rotate, range, compact, assert } from "../array";

/**
 *
 * `tonal/pcset` is a collection of functions to work with pitchclass sets.
 * It has methods to compare pitch class sets and to work with pitch class set chromas
 *
 *
 * ## Usage
 *
 * @example
 * import Pcset from "tonal/pcset"
 * Pcset.isEqual("c2 d5 e6", "c6 e3 d1") // => true
 *
 * @example
 * const Tonal = require('tonal')
 * Tonal.Pcset.chroma(['C', 'D', 'E']) // => "101010000000"
 *
 * ## API
 *
 * @module Pcset
 */
export default {
  chroma,
  chromas,
  isChroma,
  intervals,
  isSubsetOf,
  isSupersetOf,
  isEqual,
  modes,
  includes,
  filter
};

const pcsetNum = set => parseInt(chroma(set), 2);
const numNotes = chroma => chroma.replace(/0/g, "").length;

/**
 * Get chroma of a pitch class set. A chroma identifies each set uniquely.
 * It"s a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array<string>} set - the pitch class set
 * @return {string} a binary representation of the pitch class set or null
 * @example
 * Pcset.chroma(["C", "D", "E"]) // => "1010100000000"
 */
export function chroma(set) {
  if (isChroma(set)) return set;
  assert(set);
  let ch, note;
  const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < set.length; i++) {
    note = set[i];
    ch = noteChroma(note);
    if (ch === null) ch = ivlChroma(set[i]);
    if (ch === null) return null;
    binary[ch] = 1;
  }
  return binary.join("");
}

let all = null;
/**
 * Get a list of all possible chromas (all possible scales)
 * More information: http://allthescales.org/
 * @param [number] numberOfNotes - number of notes of the given chromas. Any by default
 * @return {Array<string>} an array of possible chromas from '10000000000' to '11111111111'
 *
 */
export function chromas(n) {
  all = all || range(2048, 4095).map(n => n.toString(2));
  return typeof n === "number"
    ? all.filter(chroma => numNotes(chroma) === n)
    : all.slice();
}

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|string} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<string>} an array with all the modes of the chroma
 *
 * @example
 * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
 */
export function modes(set, normalize) {
  normalize = normalize !== false;
  const binary = (chroma(set) || "").split("");
  return compact(
    binary.map(function(_, i) {
      const r = rotate(i, binary);
      return normalize && r[0] === "0" ? null : r.join("");
    })
  );
}

const REGEX = /^[01]{12}$/;
/**
 * Test if the given string is a pitch class set chroma.
 * @param {string} chroma - the pitch class set chroma
 * @return {boolean} true if its a valid pcset chroma
 * @example
 * Pcset.isChroma("101010101010") // => true
 * Pcset.isChroma("101001") // => false
 */
export function isChroma(set) {
  return REGEX.test(set);
}

const IVLS = "1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M".split(" ");
/**
 * Given a pcset (notes or chroma) return it"s intervals
 * @param {string|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * Pcset.intervals("1010100000000") => ["1P", "2M", "3M"]
 */
export function intervals(set) {
  if (!isChroma(set)) return [];
  return compact(
    set.split("").map(function(d, i) {
      return d === "1" ? IVLS[i] : null;
    })
  );
}

/**
 * Test if two pitch class sets are identical
 *
 * @param {Array|string} set1 - one of the pitch class sets
 * @param {Array|string} set2 - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */
export function isEqual(s1, s2) {
  if (arguments.length === 1) return s => isEqual(s1, s);
  return chroma(s1) === chroma(s2);
}

/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function can be partially applied
 *
 * @param {Array|string} set - an array of notes or a chroma set string to test against
 * @param {Array|string} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a subset of set, false otherwise
 * @example
 * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */
export function isSubsetOf(set, notes) {
  if (arguments.length > 1) return isSubsetOf(set)(notes);
  set = pcsetNum(set);
  return function(notes) {
    notes = pcsetNum(notes);
    return notes !== set && (notes & set) === notes;
  };
}

/**
 * Create a function that test if a collectio of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Array|string} set - an array of notes or a chroma set string to test against
 * @param {Array|string} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a superset of set, false otherwise
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */
export function isSupersetOf(set, notes) {
  if (arguments.length > 1) return isSupersetOf(set)(notes);
  set = pcsetNum(set);
  return function(notes) {
    notes = pcsetNum(notes);
    return notes !== set && (notes | set) === notes;
  };
}

/**
 * Test if a given pitch class set includes a note
 *
 * @param {Array<string>} set - the base set to test against
 * @param {string} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * Pcset.includes(["C", "D", "E"], "C4") // => true
 * Pcset.includes(["C", "D", "E"], "C#4") // => false
 */
export function includes(set, note) {
  if (arguments.length > 1) return includes(set)(note);
  set = chroma(set);
  return note => set[noteChroma(note)] === "1";
}

/**
 * Filter a list with a pitch class set
 *
 * @param {Array|string} set - the pitch class set notes
 * @param {Array|string} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */
export function filter(set, notes) {
  if (arguments.length === 1) return n => filter(set, n);
  return notes.filter(includes(set));
}
