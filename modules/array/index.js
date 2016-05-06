import { asPitch, isPitch, strPitch } from 'tonal-pitch'
import { isArr, isNum } from 'tonal-notation'
import tr from 'tonal-transpose'
function id (x) { return x }

// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/

/**
 * Convert anything to array. Speifically, split string separated by spaces,
 * commas or bars. The arrays are passed without modifications and the rest of
 * the objects are wrapped.
 *
 * This function always returns an array (null or undefined values are converted
 * to empty arrays)
 *
 * Thanks to this function, the rest of the functions of this module accepts
 * any object (or more useful: strings) as an array parameter.
 *
 * @param {*} source - the thing to get an array from
 * @return {Array} the object as an array
 *
 * @example
 * import { asArr } from 'tonal-arrays'
 * asArr('C D E F G') // => ['C', 'D', 'E', 'F', 'G']
 */
export function asArr (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}

/**
 * Map an array with a function. Basically the same as the JavaScript standard
 * `array.map` but with two enhacements:
 * - Arrays can be expressed as strings (see [asArr])
 * - This function can be partially applied. This is useful to create _mapped_
 * versions of single element functions. For an excellent introduction of
 * the adventages [read this](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html)
 *
 * @param {Function} fn - the function
 * @param {Array|String} arr - the array to be mapped
 * @return {Array}
 * @example
 * var arr = require('tonal-arr')
 * var toUp = arr.map(function(e) { return e.toUpperCase() })
 * toUp('a b c') // => ['A', 'B', 'C']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.map(tonal.transpose('M3'), 'C D E') // => ['E', 'F#', 'G#']
 */
export function map (fn, list) {
  return arguments.length > 1 ? map(fn)(list)
    : function (l) { return asArr(l).map(fn) }
}

/**
 * Filter an array with a function. Again, almost the same as JavaScript standard
 * filter function but:
 * - It accepts strings as arrays
 * - Can be partially applied
 *
 * @param {Function} fn
 * @param {String|Array} arr
 * @return {Array}
 */
export function filter (fn, list) {
  return arguments.length > 1 ? filter(fn)(list)
    : function (l) { return asArr(l).filter(fn) }
}

// #### Transform lists in array notation
function asPitchStr (p) { return strPitch(p) || p }
function listToStr (v) {
  return isPitch(v) ? strPitch(v)
    : isArr(v) ? v.map(asPitchStr)
    : v
}

/**
 * Decorates a function to so it's first parameter is an array of pitches in
 * array notation. Also, if the return value is a pitch or an array of pitches
 * in array notation, it convert backs to strings.
 *
 * @function
 * @param {Function} fn - the function to decorate
 * @return {Function} the decorated function
 * @example
 * import { listFn } from 'tonal-arrays'
 * var octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
 * octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
 */
export var listFn = (fn) => (src) => {
  var param = asArr(src).map(asPitch)
  var result = fn(param)
  return listToStr(result)
}

/**
 * Given an array of intervals, create a function that harmonizes a
 * note with this intervals.
 *
 * @function
 * @param {Array|String} ivls - the array of intervals
 * @return {Function} The harmonizer
 * @example
 * import { harmonizer } from 'tonal-arrays'
 * var maj7 = harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 */
export var harmonizer = (list) => (pitch) => {
  return listFn((list) => list.map(tr(pitch || 'P1')).filter(id))(list)
}

/**
 * Harmonizes a note with an array of intervals. It's a layer of sintatic
 * sugar over `harmonizer`.
 *
 * @function
 * @param {String|Array} ivl - the array of intervals
 * @param {String|Pitch} note - the note to be harmonized
 * @return {Array} the resulting notes
 * @example
 * var tonal = require('tonal')
 * tonal.harmonise('P1 M3 P5 M7', 'C') // => ['C', 'E', 'G', 'B']
 */
export var harmonize = function (list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list)
}

// a custom height function that
// - returns -Infinity for non-pitch objects
// - assumes pitch classes has octave -10 (so are sorted before that notes)
var objHeight = function (p) {
  if (!p) return -Infinity
  var f = p[1] * 7
  var o = isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

var ascComp = (a, b) => objHeight(a) - objHeight(b)
var descComp = (a, b) => -ascComp(a, b)

/**
 * Sort an array or notes or intervals. It uses the JavaScript standard sort
 * function.
 *
 * @param {Boolean|Function} comp - the comparator. `true` means use an
 * ascending comparator, `false` a descending comparator, or you can pass a
 * custom comparator (that receives pitches in array notation)
 * @param {Array|String} arr - the array of notes or intervals
 * @example
 * import { sort } from 'tonal-arrays'
 * sort(true, 'D E C') // => ['C', 'D', 'E']
 * @example
 * var tonal = require('tonal')
 * tonal.sort(false, 'D E C') // => ['E', 'D', 'C']
 */
export function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  var fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return listFn((arr) => arr.sort(fn))
}

/**
 * Randomizes the order of the specified array using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * import { shuffle } from 'tonal-arrays'
 * @example
 * var tonal = require('tonal')
 * tonal.shuffle('C D E F')
 */
export var shuffle = listFn(function (arr) {
  var i, t
  var m = arr.length
  while (m) {
    i = Math.random() * m-- | 0
    t = arr[m]
    arr[m] = arr[i]
    arr[i] = t
  }
  return arr
})
