import { asPitch, isPitch, strPitch, pitch } from 'tonal-pitch'
import { tr } from 'tonal-transpose'
import { distance, distInSemitones } from 'tonal-distance'
import toArr from 'as-arr'

// utility
var isArr = Array.isArray
function hasVal (e) { return e || e === 0 }

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
 * asArr('A, B, C')
 * asArr('A | B | C')
 */
export var asArr = toArr.use(/\s*\|\s*|\s*,\s*|\s+/)

/**
 * Return a new array with the elements mapped by a function.
 * Basically the same as the JavaScript standard `array.map` but with
 * two enhacements:
 *
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
 * Compact map: map an array with a function and remove nulls.
 * Can be partially applied.
 * @param {Function} fn
 * @param {Array|String} list
 * @return {Array}
 * @see map
 */
export function cMap (fn, list) {
  if (arguments.length === 1) return function (l) { return cMap(fn, list) }
  return map(fn, list).filter(hasVal)
}

/**
 * Return a copy of the array with the null values removed
 * @param {String|Array} list
 * @return {Array}
 */
export function compact (arr) {
  return asArr(arr).filter(hasVal)
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

/**
 * Given a list of notes, return the distance from the first note to the rest.
 * @param {Array|String} notes - the list of notes
 * @return {Array} the intervals
 * @example
 * tonal.harmonics('C E g') // => ['1P', '3M', '5P']
 */
export function harmonics (list) {
  var a = asArr(list)
  return a.length ? a.map(distance(a[0])).filter(hasVal) : a
}

/**
 * Given an array of intervals, create a function that harmonizes a
 * note with this intervals. Given a list of notes, return a function that
 * transpose the notes by an interval.
 *
 * @param {Array|String} ivls - the list of pitches
 * @return {Function} The harmonizer
 * @example
 * import { harmonizer } from 'tonal-arrays'
 * var maj7 = harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * var C = harmonizer('C D E')
 * C('M3') // => ['E', 'G#', 'B']
 */
export function harmonizer (list) {
  return function (tonic) {
    return cMap(tr(tonic || 'P1'), list)
  }
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
  var o = typeof p[2] === 'number' ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

// ascending comparator
function ascComp (a, b) { return objHeight(a) - objHeight(b) }
// descending comparator
function descComp (a, b) { return -ascComp(a, b) }

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
  return listFn(function (arr) {
    return arr.sort(fn)
  })
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

function trOct (n) { return tr(pitch(0, n, 1)) }

/**
 * Rotates a list a number of times. It's completly agnostic about the
 * contents of the list.
 * @param {Integer} times - the number of rotations
 * @param {Array|String} list - the list to be rotated
 * @return {Array} the rotated array
 */
export function rotate (times, list) {
  var arr = asArr(list)
  var len = arr.length
  var n = ((times % len) + len) % len
  return arr.slice(n, len).concat(arr.slice(0, n))
}

/**
 * Rotates an ascending list of pitches n times keeping the ascending property.
 * This functions assumes the list is an ascending list of pitches, and
 * transposes the them to ensure they are ascending after rotation.
 * It can be used, for example, to invert chords.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array|String} list - the list to be rotated
 * @return {Array} the rotated array
 */
export function rotateAsc (times, list) {
  return listFn(function (arr) {
    var len = arr.length
    var n = ((times % len) + len) % len
    var head = arr.slice(n, len)
    var tail = arr.slice(0, n)
    // See if the first note of tail is lower than the last of head
    var s = distInSemitones(head[len - n - 1], tail[0])
    if (s < 0) {
      var octs = Math.floor(s / 12)
      if (times < 0) head = head.map(trOct(octs))
      else tail = tail.map(trOct(-octs))
    }
    return head.concat(tail)
  })(list)
}

/**
 * Select elements from a list.
 *
 * @param {String|Array} numbers - a __1-based__ index of the elements
 * @param {String|Array} list - the list of pitches
 * @return {Array} the selected elements (with nulls if not valid index)
 *
 * @example
 * import { select } from 'tonal-array'
 * select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
 * select('-1 0 1 2 3', 'C D') // => [ null, null, 'C', 'D', null ]
 */
export function select (nums, list) {
  if (arguments.length === 1) return function (l) { return select(nums, l) }
  var arr = asArr(list)
  return asArr(nums).map(function (n) {
    return arr[n - 1] || null
  })
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
export function listFn (fn) {
  return function (list) {
    var arr = asArr(list).map(asPitch)
    var res = fn(arr)
    return listToStr(res)
  }
}
