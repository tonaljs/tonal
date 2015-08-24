'use strict'

var toList = require('./list')
var transpose = require('./transpose')
var opposite = require('../interval/opposite')

/**
 * Rotate a list
 *
 */
function rotate (list, times, octave) {
  times = times || 0
  list = toList(list)
  times = times % list.length
  if (!times) return list
  if (list[0] === 'P1') list = transpose(opposite(list[times]), list)
  var a = list.slice(times)
  var b = list.slice(0, times)
  if (octave) b = transpose('P8', b)
  return a.concat(b)
}

module.exports = rotate
