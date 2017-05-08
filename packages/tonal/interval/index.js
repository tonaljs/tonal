/**
 * A collection of functions to obtain music interval properties.
 *
 * The intervals are strings in shorthand notation. Two variations are supported:
 *
 * - standard shorthand notation: type and number, for example: 'M3', 'd-4'
 * - inverse shorthand notation: number and then type, for example: '3M', '-4d'
 *
 * The problem with the standard shorthand notation is that some strings can be
 * parsed as notes or intervals, for example: 'A4' can be note A in 4th octave
 * or an augmented four. To remove ambiguity, the prefered notation in tonal is the
 * inverse shortand notation.
 *
 * NOTE: this module is exported in tonal as ivl
 *
 * @example
 * var interval = require('tonal-interval')
 * interval.semitones('4P') // => 5
 * interval.invert('3m') // => '6M'
 * interval.simplify('9m') // => '2m'
 *
 * @example
 * // from tonal
 * var tonal = require('tonal')
 * tonal.ivl.invert('4P') // => '5P'
 *
 * @module interval
 */
import { build } from 'interval-notation'
import { asIvlPitch, ivlFn, chr, dir,
  strIvl, encode, decode, height } from 'tonal-pitch'

/**
 * Get interval name. Can be used to test if it's an interval. It accepts intervals
 * as pitch or string in shorthand notation or tonal notation. It returns always
 * intervals in tonal notation.
 *
 * @param {String|Pitch} interval - the interval string or array
 * @return {String} the interval name or null if not valid interval
 * @example
 * interval.toInterval('m-3') // => '-3m'
 * interval.toInterval('3') // => null
 */
export function toInterval (ivl) {
  var i = asIvlPitch(ivl)
  return i ? strIvl(i) : null
}

/**
 * Get the number of the interval (same as value, but always positive)
 *
 * @param {String|Pitch} interval - the interval
 * @return {Integer} the positive interval number (P1 is 1, m2 is 2, ...)
 * @example
 * interval.num('m2') // => 2
 * interval.num('P9') // => 9
 * interval.num('P-4') // => 4
 */
export function num (ivl) {
  var p = props(ivl)
  return p ? p.num : null
}

/**
 * Get the interval value (the interval number, but positive or negative
 * depending the interval direction)
 *
 * @param {String|Pitch} interval - the interval
 * @return {Integer} the positive interval number (P1 is 1, m-2 is -2, ...)
 * @example
 * interval.num('m2') // => 2
 * interval.num('m9') // => 9
 * interval.num('P-4') // => -4
 * interval.num('m-9') // => -9
 */
export function value (ivl) {
  var p = props(ivl)
  return p ? p.num * p.dir : null
}

/**
 * Get interval properties. It returns an object with:
 *
 * - num: the interval number (always positive)
 * - alt: the interval alteration (0 for perfect in perfectables, or 0 for major in _majorables_)
 * - dir: the interval direction (1 ascending, -1 descending)
 *
 * @param {String|Pitch} interval - the interval
 * @return {Array} the interval in the form [number, alt]
 * @example
 * interval.parse('m2') // => { num: 2, alt: -1, dir: 1 }
 * interval.parse('m9') // => { num: 9, alt: -1, dir: 1 }
 * interval.parse('P-4') // => { num: 4, alt: 0, dir: -1}
 * interval.parse('m-9') // => { num: 9, alt: -1, dir: -1 }
 */
export function props (ivl) {
  var i = asIvlPitch(ivl)
  if (!i) return null
  var d = decode(i)
  return { num: d[0] + 1 + d[2] * 7, alt: d[1], dir: i[2] }
}

/**
 * Given a interval property object, get the interval name
 *
 * @param {Object} props - the interval property object
 *
 * - num: the interval number
 * - alt: the interval alteration
 * - dir: the direction
 * @return {String} the interval name
 */
export function fromProps (props) {
  if (!props || props.num < 1) return null
  var octs = Math.floor((props.num) / 8)
  var simple = props.num - 7 * octs
  return build(simple, props.alt || 0, octs, props.dir)
}

/**
 * Get size in semitones of an interval
 * @param {String|Pitch} ivl
 * @return {Integer} the number of semitones or null if not an interval
 * @example
 * import { semitones } from 'tonal-interval'
 * semitones('P4') // => 5
 * // or using tonal
 * tonal.semitones('P5') // => 7
 */
export function semitones (ivl) {
  var i = asIvlPitch(ivl)
  return i ? height(i) : null
}

// interval numbers
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7]
// interval qualities
var IQ = 'P m M m M P d P m M m M'.split(' ')

/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitraty, but deterministic.
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {String} the interval name
 * @example
 * import { fromSemitones } from 'tonal-interval'
 * fromSemitones(7) // => '5P'
 * // or using tonal
 * tonal.fromSemitones(-7) // => '-5P'
 */
export function fromSemitones (num) {
  var d = num < 0 ? -1 : 1
  var n = Math.abs(num)
  var c = n % 12
  var o = Math.floor(n / 12)
  return d * (IN[c] + 7 * o) + IQ[c]
}

var CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
/**
 * Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
 * number of a given interval.
 *
 * In musical set theory, an interval class is the shortest distance in
 * pitch class space between two unordered pitch classes
 *
 * As paramter you can pass an interval in shorthand notation, an interval in
 * array notation or the number of semitones of the interval
 *
 * @param {String|Integer} interval - the interval or the number of semitones
 * @return {Integer} A value between 0 and 6
 *
 * @example
 * interval.ic('P8') // => 0
 * interval.ic('m6') // => 4
 * ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
export function ic (ivl) {
  var i = asIvlPitch(ivl)
  var s = i ? chr(i) : Math.round(ivl)
  return isNaN(s) ? null : CLASSES[Math.abs(s) % 12]
}

var TYPES = 'PMMPPMM'
/**
 * Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)
 * It does NOT return the actual quality.
 *
 * @param {String|Pitch} interval
 * @return {String} 'P' for perfectables, 'M' for majorables or null if not
 * valid interval
 * @example
 * interval.type('5A') // => 'P'
 */
export function type (ivl) {
  var i = asIvlPitch(ivl)
  return i ? TYPES[decode(i)[0]] : null
}

/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {String|Pitch} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {String|Pitch} the inverted interval
 *
 * @example
 * interval.invert('3m') // => '6M'
 * interval.invert('2M') // => '7m'
 */
export var invert = ivlFn(function (i) {
  var d = decode(i)
  // d = [step, alt, oct]
  var step = (7 - d[0]) % 7
  var alt = TYPES[d[0]] === 'P' ? -d[1] : -(d[1] + 1)
  return encode(step, alt, d[2], dir(i))
})

/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {String|Array} interval - the interval to simplify
 * @return {String|Array} the simplified interval
 *
 * @example
 * interval.simplify('9M') // => '2M'
 * ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(interval.simplify)
 * // => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
 * interval.simplify('2M') // => '2M'
 * interval.simplify('-2M') // => '7m'
 */
export var simplify = ivlFn(function (i) {
  // decode to [step, alt, octave]
  var dec = decode(i)
  // if it's not 8 reduce the octaves to 0
  if (dec[0] !== 0 || dec[2] !== 1) dec[2] = 0
  // encode back
  return encode(dec[0], dec[1], dec[2], dir(i))
})
