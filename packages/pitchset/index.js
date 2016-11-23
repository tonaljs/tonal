/**
 * Functions to create and manipulate pitch sets
 *
 * @example
 * var pitchset = require('tonal-pitchset')
 * pitchset.equal('c2 d5 e6', 'c6 e3 d1') // => true
 *
 * @module pitchset
 */
import { chr, asPitch } from 'tonal-pitch'
import { pc } from 'tonal-note'
import { map, asArr, rotate, compact } from 'tonal-array'
import { transpose } from 'tonal-transpose'

function toInt (set) { return parseInt(chroma(set), 2) }
function pitchChr (p) { p = asPitch(p); return p ? chr(p) : null }

/**
 * Given a list of notes, return the notes of the pitchset
 * starting with the first note of the list
 */
export function notes (notes) {
  var pcs = map(pc, notes)
  if (!pcs.length) return pcs
  var tonic = pcs[0]
  // since the first note of the chroma is always C, we have to rotate it
  var rotated = rotate(pitchChr(tonic), chroma(pcs).split('')).join('')
  return fromChroma(rotated, tonic)
}

/**
 * Given a pitch set (a list of notes or a pitch set chroma), produce the 12 rotations
 * of the chroma (and discard the ones that starts with '0')
 *
 * This can be used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with '0'
 * @return {Array<String>} an array with all the modes of the chroma
 *
 * @example
 */
export function chromaModes (set, normalize) {
  normalize = normalize !== false
  var binary = chroma(set).split('')
  return compact(binary.map(function (_, i) {
    var r = rotate(i, binary)
    return normalize && r[0] === '0' ? null : r.join('')
  }))
}

var REGEX = /^[01]{12}$/

/**
 * Test if the given string is a pitch set chroma.
 * @param {String} chroma - the pitch set chroma
 * @return {Boolean} true if its a valid pitchset chroma
 * @example
 * pitchset.isChroma('101010101010') // => true
 * pitchset.isChroma('101001') // => false
 */
export function isChroma (set) {
  return REGEX.test(set)
}

/**
 * Get chroma of a pitch set. A chroma identifies each pitch set uniquely.
 * It's a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch set
 * @return {String} a binary representation of the pitch set
 * @example
 * pitchset.chroma('C D E') // => '1010100000000'
 */
export function chroma (set) {
  if (isChroma(set)) return set
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  map(pitchChr, set).forEach(function (i) {
    b[i] = 1
  })
  return b.join('')
}

var IVLS = '1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M'.split(' ')
/**
 * Given a pitch set in binary notation it returns the intervals or notes
 * (depending on the tonic)
 * @param {String} binary - the pitch set in binary representation
 * @param {String|Pitch} tonic - the pitch set tonic
 * @return {Array} a list of notes or intervals
 * @example
 * pitchset.fromChroma('101010101010', 'C') // => ['C', 'D', 'E', 'Gb', 'Ab', 'Bb']
 */
export function fromChroma (binary, tonic) {
  if (arguments.length === 1) return function (t) { return fromChroma(binary, t) }
  if (!isChroma(binary)) return null

  tonic = tonic || 'P1'
  return compact(binary.split('').map(function (d, i) {
    return d === '1' ? transpose(IVLS[i], tonic) : null
  }))
}

/**
 * Test if two pitch sets are identical
 *
 * @param {Array|String} set1 - one of the pitch sets
 * @param {Array|String} set2 - the other pitch set
 * @return {Boolean} true if they are equal
 * @example
 * pitchset.equal('c2 d3', 'c5 d2') // => true
 */
export function equal (s1, s2) {
  if (arguments.length === 1) return function (s) { return equal(s1, s) }
  return chroma(s1) === chroma(s2)
}

/**
 * Test if a pitch set is a subset of another
 *
 * @param {Array|String} set - the base set to test against
 * @param {Array|String} test - the set to test
 * @return {Boolean} true if the test set is a subset of the set
 * @example
 * pitchset.subset('c d e', 'C2 D4 D5 C6') // => true
 */
export function subset (set, test) {
  if (arguments.length === 1) return function (t) { return subset(set, t) }
  test = toInt(test)
  return (test & toInt(set)) === test
}

/**
 * Test if a pitch set is a superset
 * @param {Array|String} set - the base set to test against
 * @param {Array|String} test - the set to test
 * @return {Boolean} true if the test set is a superset of the set
 * @example
 * pitchset.subset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
 */
export function superset (set, test) {
  if (arguments.length === 1) return function (t) { return superset(set, t) }
  test = toInt(test)
  return (test | toInt(set)) === test
}

/**
 * Test if a given pitch set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pitchset
 * @example
 * pitchset.includes('c d e', 'C4') // =A true
 * pitchset.includes('c d e', 'C#4') // =A false
 */
export function includes (set, note) {
  if (arguments.length > 1) return includes(set)(note)
  set = chroma(set)
  return function (note) { return set[pitchChr(note)] === '1' }
}

/**
 * Filter a list with a pitch set
 *
 * @param {Array|String} set - the pitch set
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * pitchset.filter('c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
 */
export function filter (set, notes) {
  if (arguments.length === 1) return function (n) { return filter(set, n) }
  return asArr(notes).filter(includes(set))
}
