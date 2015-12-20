'use strict'

var parse = require('array-notation/pitch/parse')
var str = require('array-notation/pitch/str')
var distanceTo = require('note-interval')
var transpose = require('note-transpose')
var SEP = /\s*\|\s*|\s*,\s*|\s+/
var toStr = function (s) { return Array.isArray(s) ? str(s) : s }

/**
 * A gamut is a collection of intervals, pitch classes or notes.
 * Scales, chords, pitch sets are examples of gamuts.
 *
 * @name gamut
 * @param {String|Array} source - a list of elements
 * @param {String|Function} operation - the operation to perfom
 * @return {Array} a list of pitches
 *
 * @example
 * var gamut = require('music-gamut')
 * gamut('c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
 */
function gamut (source, op) {
  if (op === false) return gamut.harmonizer(source, false)
  if (typeof op === 'function') return gamut.operation(op)(source)
  var g = gamut.split(source)
  return g.map(function (e) { return str(parse(e)) })
}

/**
 * Convert a source to an array. If the source is an array, return it.
 *
 * Aside from an array itself, the source can be a
 * string with elements separated by spaces, commas or bars (`|`) or a single
 * element that will be wrapped inside an array
 *
 * This function __does not perform any transformation__ of the array elements.
 * and __it always return an array, even if its empty__.
 *
 * @name gamut.split
 * @function
 * @param {String|Array} source - the source
 * @return {Array} the source as array
 *
 * @example
 * var G = require('music-gamut')
 * G.split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
 * G.split() // => []
 */
gamut.split = function (source) {
  if (Array.isArray(source)) return source
  else if (typeof source === 'string') return source.trim().split(SEP)
  else if (source === null || typeof source === 'undefined') return []
  else return [ source ]
}

/**
 * Decorate a function to work with gamuts.
 *
 * The function to decorate receives an array of pitches in
 * [array notation]()  and should return the desired transformed array.
 *
 * @name gamut.operation
 * @function
 * @param {Function} fn - the function to decorate
 * @return {Function} the decorated function
 */
gamut.operation = function (fn) {
  return function (source) {
    var g = gamut.split(source)
    if (Array.isArray(g[0])) return fn(g)
    var v = fn(g.map(parse))
    return Array.isArray(v) ? v.map(toStr) : v
  }
}

/**
 * Create an harmonizer
 */
gamut.harmonizer = function (source, tonic) {
  return gamut(source, function (g) {
    var base = g[0]
    var intervals = g.map(distanceTo(base))
    if (tonic === false) return intervals
    tonic = parse(tonic)
    return intervals.map(transpose(tonic))
  })
}

function height (p) {
  if (!p) return -Infinity
  var f = p[0] * 7
  var o = p[1] || p[1] === 0 ? p[1] : -Math.floor(f / 12) - 10
  return f + o * 12
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
 * var rotate = require('music.kit/gamut/rotate')
 * rotate(1, 'C D E') // => ['D', 'E', 'C']
 */
gamut.rotate = function (count, source) {
  var g = gamut.split(source)
  var len = g.length
  var n = ((count % len) + len) % len
  return g.slice(n, len).concat(g.slice(0, n))
}

/**
 * Get a gamut in ascdening pitch order
 *
 * @name gamut.sort
 * @function
 * @param {String|Array} gamut - the gamut to sort
 * @return {Array} the gamut in sort pitch order
 *
 * @example
 * var gamut = require('music-gamut')
 * gamut.sort('c5 d2 f4 D2') // => ['D2', 'D2', 'F4', 'C5']
 */
gamut.sort = gamut.operation(function (g) {
  return g.sort(function (a, b) {
    return height(a) - height(b)
  })
})

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
 * var gamut = require('tonal.gamut')
 * gamut.select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
 */
gamut.select = function s (nums, src) {
  if (arguments.length === 1) return function (g) { return s(nums, g) }
  var g = gamut.split(src)
  return gamut.split(nums).map(function (n) {
    return g[n - 1]
  })
}

if (typeof module === 'object' && module.exports) module.exports = gamut
if (typeof window !== 'undefined') window.gamut = gamut
