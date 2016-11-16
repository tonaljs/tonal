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
import { map } from 'tonal-array'

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
  test = toInt(test)
  return (test | toInt(set)) === test
}
