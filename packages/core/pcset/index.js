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
import { chr, asPitch } from 'tonal-pitch'
import { pc } from 'tonal-note'
import { map, asArr, rotate, compact } from 'tonal-array'
import { transpose } from 'tonal-transpose'

function chrToInt (set) { return parseInt(chroma(set), 2) }
function pitchChr (p) { p = asPitch(p); return p ? chr(p) : null }

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
 * pcset.chroma('C D E') // => '1010100000000'
 */
export function chroma (set) {
  if (isChroma(set)) return set
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  map(pitchChr, set).forEach(function (i) {
    b[i] = 1
  })
  return b.join('')
}

/**
 * @deprecated
 * @see collection.pcset
 * Given a list of notes, return the pitch class names of the set
 * starting with the first note of the list
 * @param {String|Array} notes - the pitch class set notes
 * @return {Array} an array of pitch class sets
 */
export function notes (notes) {
  // FIXME: move to collection
  console.warn('pcset.notes deprecated. Use collection.pcset')
  var pcs = map(pc, notes)
  if (!pcs.length) return pcs
  var tonic = pcs[0]
  // since the first note of the chroma is always C, we have to rotate it
  var rotated = rotate(pitchChr(tonic), chroma(pcs).split('')).join('')
  return fromChroma(rotated, tonic)
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
 * pcset.modes('C E G')
 */
export function modes (set, normalize) {
  normalize = normalize !== false
  var binary = chroma(set).split('')
  return compact(binary.map(function (_, i) {
    var r = rotate(i, binary)
    return normalize && r[0] === '0' ? null : r.join('')
  }))
}
/**
 * @deprecated
 * @see modes
 */
export function chromaModes (set, norm) {
  console.warn('pcset.chromaModes deprecated. Renamed to pcset.modes')
  return modes(set, norm)
}

var REGEX = /^[01]{12}$/

/**
 * Test if the given string is a pitch class set chroma.
 * @param {String} chroma - the pitch class set chroma
 * @return {Boolean} true if its a valid pcset chroma
 * @example
 * pcset.isChroma('101010101010') // => true
 * pcset.isChroma('101001') // => false
 */
export function isChroma (set) {
  return REGEX.test(set)
}

var IVLS = '1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M'.split(' ')
/**
 * Given a pcset (notes or chroma) return it's intervals
 * @param {String|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * pcset.intervals('1010100000000') => ['C', 'D', 'E']
 */
export function intervals (set) {
  return compact(chroma(set).split('').map(function (d, i) {
    return d === '1' ? IVLS[i] : null
  }))
}

/**
 * @deprecated
 * @see intervals
 * Given a pitch class set in binary notation it returns the intervals or notes
 * (depending on the tonic)
 * @param {String} binary - the pitch class set in binary representation
 * @param {String|Pitch} tonic - the pitch class set tonic
 * @return {Array} a list of notes or intervals
 * @example
 * pcset.fromChroma('101010101010', 'C') // => ['C', 'D', 'E', 'Gb', 'Ab', 'Bb']
 */
export function fromChroma (binary, tonic) {
  console.warn('pcset.fromChroma is deprecated. Use pcset.intervals().map(...)')
  if (arguments.length === 1) return function (t) { return fromChroma(binary, t) }
  if (!tonic) tonic = 'P1'
  return intervals(binary).map(transpose(tonic))
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
export function isEqual (s1, s2) {
  if (arguments.length === 1) return function (s) { return isEqual(s1, s) }
  return chroma(s1) === chroma(s2)
}
export function equal (a, b) {
  console.warn('pcset.equal is deprecated. Use pcset.isEqual')
  return isEqual(a, b)
}

/**
 * Test if a pitch class set is a subset of another
 *
 * @param {Array|String} set - the base set to test against
 * @param {Array|String} test - the set to test
 * @return {Boolean} true if the test set is a subset of the set
 * @example
 * pcset.subset('c d e', 'C2 D4 D5 C6') // => true
 */
export function isSubset (set, test) {
  if (arguments.length === 1) return function (t) { return isSubset(set, t) }
  test = chrToInt(test)
  return (test & chrToInt(set)) === test
}
export function subset (a, b) {
  console.warn('pcset.subset is deprecated. Use pcset.isSubset')
  return isSubset(a, b)
}

/**
 * Test if a pitch class set is a superset
 *
 * @param {Array|String} set - the base set to test against
 * @param {Array|String} test - the set to test
 * @return {Boolean} true if the test set is a superset of the set
 * @example
 * pcset.isSuperset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
 */
export function isSuperset (set, test) {
  if (arguments.length === 1) return function (t) { return isSuperset(set, t) }
  test = chrToInt(test)
  return (test | chrToInt(set)) === test
}
export function superset (a, b) {
  console.warn('pcset.superset is deprecated. Use pcset.isSuperset')
  return isSuperset(a, b)
}

/**
 * Test if a given pitch class set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pcset
 * @example
 * pcset.includes('c d e', 'C4') // =A true
 * pcset.includes('c d e', 'C#4') // =A false
 */
export function includes (set, note) {
  if (arguments.length > 1) return includes(set)(note)
  set = chroma(set)
  return function (note) { return set[pitchChr(note)] === '1' }
}

/**
 * Filter a list with a pitch class set
 *
 * @param {Array|String} set - the pitch class set notes
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * pcset.filter('c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
 * pcset.filter('c2', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'c3' ])
 */
export function filter (set, notes) {
  if (arguments.length === 1) return function (n) { return filter(set, n) }
  return asArr(notes).filter(includes(set))
}
