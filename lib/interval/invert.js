'use strict'
var parse = require('./parse')

/**
 * Invert an interval
 *
 * Get the [inversion](https://en.wikipedia.org/wiki/Interval_(music)#Inversion)
 * of an interval.
 *
 * @param {String} interval - the interval to invert
 * @param {Boolean} ascending - (Optional) if true, the inverted interval will
 * be ascending, if false (by default) the direction will be the same as the
 * given interval
 *
 * @example
 * simple('M9') // => 'M2'
 * simple('M-10') // => 'M-3'
 * simple('P-11', true) // => 'P4'
 */
function invert (interval, ascending) {
  interval = parse(interval)
  var quality = INVERT[interval.quality]
  var simple = interval.simple
  var dir = ascending === true ? 1 : interval.dir
  var num = 9 - simple
  return quality + (dir * num)
}

module.exports = invert

var INVERT = {'d': 'A', 'm': 'M', 'P': 'P', 'M': 'm', 'A': 'd'}
