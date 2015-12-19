'use strict'

var parse = require('array-notation/pitch/parse')
var str = require('array-notation/pitch/str')
var distanceTo = require('note-interval')
var transpose = require('note-transpose')
var SEP = /\s*\|\s*|\s*,\s*|\s+/

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
 * split = require('music.kit/gamut.split')
 * split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
 * split() // => []
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
    return Array.isArray(v) ? v.map(str) : v
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

if (typeof module === 'object' && module.exports) module.exports = gamut
if (typeof window !== 'undefined') window.gamut = gamut
