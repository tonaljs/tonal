'use strict'

var parse = require('./parse-interval')

var INVERT = {'d': 'A', 'm': 'M', 'P': 'P', 'M': 'm', 'A': 'd'}

/**
 * Get the inverted interval of the given one
 *
 * @param {String|Interval} interval - the interval to be inverted
 * @return {String} the inverted Interval
 *
 * @example
 * var invert = require('tonal/invert')
 * invert('M3') // => 'm6'
 */
function invertInterval (interval) {
  interval = parse(interval)
  var pivot = interval.num < 0 ? -9 : 9
  var num = pivot - interval.num
  var q = INVERT[interval.name[0]]
  return q + num
}

module.exports = invertInterval
