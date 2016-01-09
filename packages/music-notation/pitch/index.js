'use strict'

var str = require('./str')
var parse = require('./parse')
var op = require('../operation')

/**
 * In music-notation, a pitch is a note in scintific notation or an interval
 * in shorthand notation. This functions returns the pitch string from an object (either
 * an string or an pitch in array notation) or decorates a function to operate
 * pitches in array-notation
 *
 * @name pitch
 * @function
 * @param {Object|Function} source - the pitch object or the function to decorate
 * @return {String|Function} the pitch string or the decorated function
 *
 * @example
 * var pitch = require('music-notation/pitch')
 * // get pitch string
 * pitch('fx2') // => 'F##2'
 * pitch('bbb') // => 'Bbb'
 * pitch([2, 0]) // => 'M2'
 *
 * // decorate function
 * var octUp = pitch(function (p) { return [ p[0], p[1] + 1, p[2] ] })
 * octUp('C#3') // => 'C#4'
 */
module.exports = function (s) {
  if (typeof s === 'function') return op(parse, str, s)
  else if (typeof s === 'string') return str(parse(s))
  else if (Array.isArray(s)) return str(s)
  return null
}
