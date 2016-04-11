'use strict'

var semitones = require('semitones')
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
 * @name intervalClass
 * @function
 * @param {String|Integer} interval - the interval or the number of semitones
 * @return {Integer} A value between 0 and 6
 *
 * @example
 * var ic = require('interval-class')
 * ic('P8') // => 0
 * ic('m6') // => 4
 * ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
module.exports = function (ivl) {
  var s = typeof ivl === 'string' ? semitones(ivl) : Math.round(ivl)
  return s !== null ? CLASSES[Math.abs(s) % 12] : null
}
