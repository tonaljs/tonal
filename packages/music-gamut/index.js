'use strict'

var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var SEP = /\s*\|\s*|\s*,\s*|\s+/

var isArray = Array.isArray
function toStr (s) { return isArray(s) ? str(s) : s }
function toArr (s) { return isArray(s) ? s : parse(s) }

function id (e) { return e }

/**
 * A gamut is a collection of intervals, pitch classes or notes.
 * Scales, chords, pitch sets are examples of gamuts.
 *
 * With this function you can manipulate music gamuts in array notation.
 *
 * @name gamut
 * @param {String|Function} operation - the operation to perfom
 * @param {String|Array} source - a list of elements
 * @return {Array} a list of pitches
 *
 * @example
 * var gamut = require('music-gamut')
 * gamut('c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
 */
function gamut (op, source) {
  if (arguments.length === 1 && typeof op !== 'function') return gamut(id, op)
  return gamut.operation(op)(source)
}

/**
 * Given a gamut get its notes or intervals in [array notation]()
 *
 * @name gamut.parse
 * @function
 * @param {Array|String} source - the notes or intervals
 * @return {Array} the notes or intervals in array notation
 *
 * @example
 * var gamut = require('music-gamut')
 * gamut.parse('C D E') // => [ [0], [2], [4] ]
 */
gamut.parse = function (source) {
  return gamut.split(source).map(toArr)
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
    if (isArray(g[0])) return fn(g)
    var v = fn(g.map(parse))
    return isArray(v) ? v.map(toStr) : v
  }
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
  if (isArray(source)) return source
  else if (typeof source === 'string') return source.trim().split(SEP)
  else if (source === null || typeof source === 'undefined') return []
  else return [ source ]
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
