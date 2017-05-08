/**
 * This module implements utility functions related to array manipulation, like:
 * `map`, `filter`, `shuffle`, `sort`, `rotate`, `select`
 *
 * All the functions are _functional friendly_ with target object as last
 * parameter and currified. The sorting functions understand about pitch
 * heights and interval sizes.
 *
 * One key feature of tonal is that you can represent lists with arrays or
 * with space separated string of elements. This module implements that
 * functionallity.
 *
 * @module array
 */
import { asPitch, isPitch, strPitch, pitch, fifths, focts } from 'tonal-pitch'
import { transpose as tr } from 'tonal-transpose'
import { semitones } from 'tonal-distance'

function split (sep) {
  return function (o) {
    return o === undefined ? []
      : Array.isArray(o) ? o
      : typeof o === 'string' ? o.trim().split(sep) 
      : [o]
  }
}

// utility
var isArr = Array.isArray
function hasVal (e) {
  return e || e === 0
}

/**
 * Convert anything to array. Speifically, split string separated by spaces,
 * commas or bars. If you give it an actual array, it returns it without
 * modification.
 *
 * This function __always__ returns an array (null or undefined values are converted
 * to empty arrays)
 *
 * Thanks to this function, the rest of the functions of this module accepts
 * strings as an array parameter.
 *
 * @function
 * @param {*} source - the thing to get an array from
 * @return {Array} the object as an array
 *
 * @example
 * import { asArr } from 'tonal-arrays'
 * asArr('C D E F G') // => ['C', 'D', 'E', 'F', 'G']
 * asArr('A, B, c') // => ['A', 'B', 'c']
 * asArr('1 | 2 | x') // => ['1', '2', 'x']
 */
export var asArr = split(/\s*\|\s*|\s*,\s*|\s+/)

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
  return arguments.length > 1
    ? map(fn)(list)
    : function (l) {
      return asArr(l).map(fn)
    }
}

/**
 * Return a copy of the array with the null values removed
 * @param {String|Array} list
 * @return {Array}
 * @example
 * tonal.compact(['a', 'b', null, 'c']) // => ['a', 'b', 'c']
 */
export function compact (arr) {
  return asArr(arr).filter(hasVal)
}

/**
 * Filter an array with a function. Again, almost the same as JavaScript standard
 * filter function but:
 *
 * - It accepts strings as arrays
 * - Can be partially applied
 *
 * @param {Function} fn
 * @param {String|Array} arr
 * @return {Array}
 * @example
 * t.filter(t.noteName, 'a b c x bb') // => [ 'a', 'b', 'c', 'bb' ]
 */
export function filter (fn, list) {
  return arguments.length > 1
    ? filter(fn)(list)
    : function (l) {
      return asArr(l).filter(fn)
    }
}

// a custom height function that
// - returns -Infinity for non-pitch objects
// - assumes pitch classes has octave -100 (so are sorted before that notes)
function objHeight (p) {
  if (!p) return -Infinity
  var f = fifths(p) * 7
  var o = focts(p) || -Math.floor(f / 12) - 100
  return f + o * 12
}

// ascending comparator
function ascComp (a, b) {
  return objHeight(a) - objHeight(b)
}
// descending comparator
function descComp (a, b) {
  return -ascComp(a, b)
}

/**
 * Sort a list of notes or intervals in ascending or descending pitch order.
 * It removes from the list any thing is not a pitch (a note or interval)
 *
 * Note this function returns a __copy__ of the array, it does NOT modify
 * the original.
 *
 * @param {Array|String} list - the list of notes or intervals
 * @param {Boolean|Function} comp - (Optional) comparator.
 * Ascending pitch by default. Pass a `false` to order descending
 * or a custom comparator function (that receives pitches in array notation).
 * Note that any other value is ignored.
 * @example
 * array.sort('D E C') // => ['C', 'D', 'E']
 * array.sort('D E C', false) // => ['E', 'D', 'C']
 * // if is not a note, it wil be removed
 * array.sort('g h f i c') // => ['C', 'F', 'G']
 */
export function sort (list, comp) {
  var fn = arguments.length === 1 || comp === true
    ? ascComp
    : comp === false ? descComp : typeof comp === 'function' ? comp : ascComp
  // if the list is an array, make a copy
  list = Array.isArray(list) ? list.slice() : asArr(list)
  return listFn(function (arr) {
    return arr.sort(fn).filter(hasVal)
  }, list)
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
    i = (Math.random() * m--) | 0
    t = arr[m]
    arr[m] = arr[i]
    arr[i] = t
  }
  return arr
})

function trOct (n) {
  return tr(pitch(0, n, 1))
}

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
  var n = (times % len + len) % len
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
    var n = (times % len + len) % len
    var head = arr.slice(n, len)
    var tail = arr.slice(0, n)
    // See if the first note of tail is lower than the last of head
    var s = semitones(head[len - n - 1], tail[0])
    if (s < 0) {
      var octs = Math.floor(s / 12)
      if (times < 0) head = head.map(trOct(octs))
      else tail = tail.map(trOct(-octs))
    }
    return head.concat(tail)
  }, list)
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
  if (arguments.length === 1) {
    return function (l) {
      return select(nums, l)
    }
  }
  var arr = asArr(list)
  return asArr(nums).map(function (n) {
    return arr[n - 1] || null
  })
}

// http://stackoverflow.com/questions/9960908/permutations-in-javascript
/**
 * Get all permutations of a list
 * @param {Array|Strng} list - the list
 * @return {Array<Array>} an array with all the permutations
 */
export function permutations (list) {
  list = asArr(list)
  if (list.length === 0) return [[]]
  return permutations(list.slice(1)).reduce(function (acc, perm) {
    return acc.concat(
      list.map(function (e, pos) {
        var newPerm = perm.slice()
        newPerm.splice(pos, 0, list[0])
        return newPerm
      })
    )
  }, [])
}

// #### Transform lists in array notation
function asPitchStr (p) {
  return strPitch(p) || p
}
function listToStr (v) {
  return isPitch(v) ? strPitch(v) : isArr(v) ? v.map(asPitchStr) : v
}

/**
 * Decorates a function to so it's first parameter is an array of pitches in
 * array notation. Also, if the return value is a pitch or an array of pitches
 * in array notation, it convert backs to strings.
 *
 * @private
 * @param {Function} fn - the function to decorate
 * @return {Function} the decorated function
 * @example
 * import { listFn } from 'tonal-arrays'
 * var octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
 * octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
 */
function listFn (fn, list) {
  if (arguments.length === 1) {
    return function (l) {
      return listFn(fn, l)
    }
  }
  var arr = asArr(list).map(asPitch)
  var res = fn(arr)
  return listToStr(res)
}
