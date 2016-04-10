'use strict'

var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')

var SEP = /\s*\|\s*|\s*,\s*|\s+/
function split (source) {
  if (isArray(source)) return source
  else if (typeof source === 'string') return source.trim().split(SEP)
  else if (source === null || typeof source === 'undefined') return []
  else return [ source ]
}
var isArray = Array.isArray
function toStr (s) { return isArray(s) ? str(s) : s }
function toArr (s) { return isArray(s) ? s : parse(s) }
function id (e) { return e }

/**
 * Transform a collection of pitches with a function.
 *
 * It will convert the collection of pitches to array notation, perform the
 * transformation and convert the pitches back to strings.
 *
 * The collection of pitches (notes, pitch classes or intervals) that can be
 * expressed as an array or as string.
 *
 * The function will receive the gamut in [array notation]() and must return
 * the result. If the result is an array of pitches in array notation they will
 * be converted back to note strings.
 *
 * If the given function is `false` the gamut is returned (as an array) but
 * with no transformation applied.
 *
 * If the given function is `null` the gamut is returned (as an array) with
 * the non-pitched elements filtered.
 *
 * This is the base function to derive `map`, `reduce` and `filter`
 *
 * @name transform
 * @param {Function|Boolean} fn - the function to transform the gamut. If false
 * @param {String|Array} source - a list of elements
 * @return {Array} a list of pitches
 *
 * @example
 * var gamut = require('music-gamut')
 * // filter notes elements
 * gamut(null, 'c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
 */
function transform (fn, source) {
  if (arguments.length > 1) return transform(fn)(source)

  return function (source) {
    var g = split(source)
    if (fn === false) return g
    if (fn === null) fn = id
    else if (typeof fn !== 'function') throw Error('Invalid function')
    if (isArray(g[0])) return fn(g)
    var v = fn(g.map(parse))
    return isArray(v) ? v.map(toStr) : v
  }
}

/**
 * Map a gamut with a function. The function operates pitches in array notation
 *
 * @param {Function} fn - the function used to map gamut elements
 * @param {Array|String} pitches - the pithes
 * @return {Array} the mapped gamut
 *
 * @example
 * var gamut = require('music-gamut')
 * var octUp = gamut.map(function (n) { return [n[0], n[1] + 1, n[2]] })
 * octUp('c2 d3 e4') // => [ 'C3', 'D4', 'E5' ]
 */
function map (fn, source) {
  if (arguments.length > 1) return map(fn)(source)
  return transform(function (g) { return g.map(fn) })
}

/**
 * Filter a gamut with a function. The function operates pitches in array notation.
 *
 * This function is currified.
 *
 * @param {Function} fn - the function used to filter the gamut. It must return
 * true or false to include or exclude the note from the gamut. It receives one
 * parameter of a pitch in array notation (can be null)
 * @param {Array|String} pitches - the pitches to filter
 * @return {Array<String>} the filtered notes
 *
 * @example
 * var onlyC = gamut.filter(function(p) { return p[0] === 0 })
 * onlyC('c2 d3 c4 f6 c7') // => ['C2', 'C4', 'C7']
 */
function filter (fn, source) {
  if (arguments.length > 1) return filter(fn)(source)
  return transform(function (g) { return g.filter(fn) })
}

/**
 * Applies a function against an accumulator and each value of a pitch
 * collection.
 *
 * This function is currified so can be partially applied
 */
function reduce (fn, acc, source) {
  if (arguments.length === 1) return function (a, s) { return reduce(fn, a, s) }
  if (arguments.length > 2) return reduce(fn, acc)(source)
  return transform(function (g) { return g.reduce(fn, acc) })
}

/**
 * Rotate the gamut
 *
 * @name gamut.rotate
 * @function
 * @param {Integer} count - the number of rotations
 * @param {String|Array} gamut - a list of notes or intervals
 * @return {Array} the gamut rotated count times
 *
 * @example
 * var G = require('music-gamut')
 * G.rotate(1, 'C D E') // => ['D', 'E', 'C']
 */
function rotate (count, source) {
  var g = split(source)
  var len = g.length
  var n = ((count % len) + len) % len
  return g.slice(n, len).concat(g.slice(0, n))
}

/**
 * Select some elements from a gamut
 *
 * @name gamut.select
 * @function
 * @param {String|Array} numbers - a __1-based__ index of the elements
 * @param {String|Array} gamut - the notes or intervals
 * @return {Array} the selected elements
 *
 * @example
 * var gamut = require('music-gamut')
 * gamut.select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
 */
function select (nums, src) {
  if (arguments.length === 1) return function (g) { return select(nums, g) }
  var g = split(src)
  return split(nums).map(function (n) {
    return g[n - 1]
  })
}

var G = { transform: transform,
  /**
   * Split a collection of notes into an array.
   * No transformation to notes is performed.
   *
   * An alias for `gamut.transform(false)`
   * @name split
   * @function
   * @param {String|Array} notes - the notes to split
   * @return {Array} the notes as an array
   */
  split: transform(false),
  map: map, reduce: reduce, filter: filter,
  rotate: rotate, select: select }

if (typeof module === 'object' && module.exports) module.exports = G
if (typeof window !== 'undefined') window.gamut = G
