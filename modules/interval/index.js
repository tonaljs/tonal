import { asIvlPitch, ivlFn, chr, fifths, focts, dir,
  strIvl, encode, decode } from 'tonal-pitch'

/**
 * Get interval name. Can be used to test if it's an interval. It accepts intervals
 * as pitch or string in shorthand notation or tonal notation. It returns always
 * intervals in tonal notation.
 *
 * @param {String|Pitch} ivl
 * @param {String} the interval name or null if not valid interval
 * @example
 * import { ivlName } from 'tonal-interval'
 * ivlName('m-3') // => '-3m'
 * ivlName('3') // => null
 * // part of tonal
 * tonal.ivlName('blah') // => null
 */
export function ivlName (ivl) {
  var i = asIvlPitch(ivl)
  return i ? strIvl(i) : null
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
  return i ? 7 * fifths(i) + 12 * focts(i) : null
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
 * const ic = require('interval-class')
 * ic('P8') // => 0
 * ic('m6') // => 4
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
 * @param {String|Pitch} interval
 * @return {String} 'P' for perfectables, 'M' for majorables or null if not
 * valid interval
 * @example
 * tonal.itype('5A') // => 'P'
 */
export function itype (ivl) {
  var i = asIvlPitch(ivl)
  return i ? TYPES[decode(i)[0]] : null
}

/**
 * Get the [inversion](https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {String|Pitch} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {String|Pitch} the inverted interval
 *
 * @example
 * import { invert } from 'tonal-interval'
 * invert('3m') // => '6M'
 * // or using tonal
 * tonal.invert('2M') // => '7m'
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
 * import { simplify } from 'tonal-interval'
 * simplify('9M') // => '2M'
 * ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(simplify)
 * // => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
 * simplify('2M') // => '2M'
 * simplify('-2M') // => '7m'
 * // part of tonal
 * tonal.simplify('9m') // => '2m'
 */
export var simplify = ivlFn(function (i) {
  // decode to [step, alt, octave]
  var dec = decode(i)
  // if it's not 8 reduce the octaves to 0
  if (dec[0] !== 0 || dec[2] !== 1) dec[2] = 0
  // encode back
  return encode(dec[0], dec[1], dec[2], dir(i))
})
