'use strict'
var parse = require('./parse')
var simple = require('./simpleNumber')

/**
 * Invert an interval
 *
 */
function invert (interval) {
  interval = parse(interval)
  var quality = INVERT[interval.quality]
  var num = 9 - simple(interval.num)
  return quality + (interval.dir * num)
}

module.exports = invert

var INVERT = {'d': 'A', 'm': 'M', 'P': 'P', 'M': 'm', 'A': 'd'}
