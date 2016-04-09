'use strict'

var parse = require('music-notation/interval/parse')
var str = require('music-notation/interval/str')
var op = require('music-notation/operation')

/**
 * Get the [inversion](https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * The inversion of any compound interval is always the same as the
 * inversion of the simple interval from which it is compounded
 *
 * @name interval.invert
 * @param {String|Array} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {String|Array} the inverted interval
 *
 * @example
 * var invert = require('interval-invert')
 * invert('3m') // => '6M'
 */
module.exports = op(parse, str, function (i) {
  if (!Array.isArray(i)) return null
  if (i[0] === 0 && i[1] === 0) return i
  var simple = [i[0], -Math.floor(i[0] * 7 / 12)]
  return [-simple[0], -simple[1] + 1]
})
