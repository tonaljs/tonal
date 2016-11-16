/**
 * Functions to create and manipulate pitch sets
 *
 * @example
 * var pitchset = require('tonal-pitchset')
 * pitchset.equal('c2 d5 e6', 'c6 e3 d1') // => true
 *
 * @module pitchset
 */
import { chroma } from 'tonal-note'
import { map, asArr } from 'tonal-array'

function toInt (set) { return parseInt(toBinary(set), 2) }

/**
 * Convert a pitch set into a binary representation
 *
 * @param {Array|String} set - the pitch set
 * @return {String} a binary representation of the pitch set
 * @example
 * pitchset.toBinary('C D E') // => '1010100000000'
 */
export function toBinary (set) {
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  map(chroma, set).forEach(function (i) {
    b[i] = 1
  })
  return b.join('')
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
  return toBinary(s1) === toBinary(s2)
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
  set = toBinary(set)
  return function (note) { return set[chroma(note)] === '1' }
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
