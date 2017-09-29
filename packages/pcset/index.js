/**
 * [![npm version](https://img.shields.io/npm/v/tonal-pcset.svg?style=flat-square)](https://www.npmjs.com/package/tonal-pcset)
 * [![tonal](https://img.shields.io/badge/tonal-pcset-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-pcset` is a collection of functions to work with pitch class sets, oriented
 * to make comparations (isEqual, isSubset, isSuperset)
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * You can install via npm: `npm i --save tonal-pcset`
 *
 * ```js
 * var pcset = require('tonal-pcset')
 * pcset.isEqual('c2 d5 e6', 'c6 e3 d1') // => true
 * ```
 *
 * ## API documentation
 *
 * @module pcset
 */
import { chroma as notechr } from "tonal-note";
import { chroma as ivlchr } from "tonal-interval";
import { rotate } from "tonal-array";

const chr = str => notechr(str) || ivlchr(str) || 0;
const pcsetNum = set => parseInt(chroma(set), 2);
const compact = arr => arr.filter(x => x);

/**
 * Get chroma of a pitch class set. A chroma identifies each set uniquely.
 * It's a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch class set
 * @return {String} a binary representation of the pitch class set
 * @example
 * pcset.chroma(["C", "D", "E"]) // => '1010100000000'
 */
export function chroma(set) {
  if (isChroma(set)) return set;
  if (!Array.isArray(set)) return "";
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  set.map(chr).forEach(i => {
    b[i] = 1;
  });
  return b.join("");
}

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with '0'
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with '0'
 * @return {Array<String>} an array with all the modes of the chroma
 *
 * @example
 * pcset.modes(["C", "D", "E"]).map(pcset.intervals)
 */
export function modes(set, normalize) {
  normalize = normalize !== false;
  var binary = chroma(set).split("");
  return compact(
    binary.map(function(_, i) {
      var r = rotate(i, binary);
      return normalize && r[0] === "0" ? null : r.join("");
    })
  );
}

var REGEX = /^[01]{12}$/;
/**
 * Test if the given string is a pitch class set chroma.
 * @param {String} chroma - the pitch class set chroma
 * @return {Boolean} true if its a valid pcset chroma
 * @example
 * pcset.isChroma('101010101010') // => true
 * pcset.isChroma('101001') // => false
 */
export function isChroma(set) {
  return REGEX.test(set);
}

var IVLS = "1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M".split(" ");
/**
 * Given a pcset (notes or chroma) return it's intervals
 * @param {String|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * pcset.intervals('1010100000000') => ["1P", "2M", "3M"]
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
 * @param {Array|String} set1 - one of the pitch class sets
 * @param {Array|String} set2 - the other pitch class set
 * @return {Boolean} true if they are equal
 * @example
 * pcset.isEqual('c2 d3', 'c5 d2') // => true
 */
export function isEqual(s1, s2) {
  if (arguments.length === 1) return s => isEqual(s1, s);
  return chroma(s1) === chroma(s2);
}

/**
 * Test if a pitch class set is a subset of another
 *
 * @param {Array|String} test - the set to test
 * @param {Array|String} set - the base set to test against
 * @return {Boolean} true if the test set is a subset of the set
 * @example
 * pcset.subset('c d e', 'C2 D4 D5 C6') // => true
 */
export function isSubset(test, set) {
  test = pcsetNum(test);
  return (test & pcsetNum(set)) === test;
}

/**
 * Test if a pitch class set is a superset
 *
 * @param {Array|String} test - the set to test
 * @param {Array|String} set - the base set to test against
 * @return {Boolean} true if the test set is a superset of the set
 * @example
 * pcset.isSuperset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
 */
export function isSuperset(test, set) {
  test = pcsetNum(test);
  return (test | pcsetNum(set)) === test;
}

/**
 * Test if a given pitch class set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pcset
 * @example
 * pcset.includes('c d e', 'C4') // => true
 * pcset.includes('c d e', 'C#4') // => false
 */
export function includes(set, note) {
  if (arguments.length > 1) return includes(set)(note);
  set = chroma(set);
  return function(note) {
    return set[chr(note)] === "1";
  };
}

/**
 * Filter a list with a pitch class set
 *
 * @param {Array|String} set - the pitch class set notes
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * pcset.filter(c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
 * pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ 'c2', 'c3' ])
 */
export function filter(set, notes) {
  if (arguments.length === 1) return n => filter(set, n);
  return notes.filter(includes(set));
}
