'use strict'

var parse = require('../pitch/parse')
var FIFTHS = [4, 1, 5, 2, 6, 3, 7]

/**
 * Get the distance in fifths between two pitch classes
 *
 * @param {String} pitch - the pitch to get the distance distance to
 * @param {String} from - (Optional) the pitch to get the distance from
 * (C if not specified)
 * @return {Integer} the number of fifths (can be negative)
 *
 * @example
 * distance('C') // => 0
 * distance('G') // => 1
 * distance('D') // => 2
 * distance('F') // => -1
 * distance('Bb') // => -2
 * distance('A', 'D') // => 1
 * distance('C4', 'C2') // => 0
 */
function distance (pitch, from) {
  pitch = parse(pitch)
  if (pitch === null) return null
  var mod = parse(from) ? distance(from) : 0

  var alter = pitch[1] * 7
  return FIFTHS.indexOf(pitch[0]) + alter - mod - 1
}

module.exports = distance
