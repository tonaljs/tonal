'use strict'

var props = require('../pitch/props')
var LINE = 'FCGDAEB'

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
  pitch = props(pitch)
  if (pitch === null) return null
  var mod = props(from) ? distance(from) : 0

  var alter = pitch.alter * 7
  return LINE.indexOf(pitch.letter) + alter - mod - 1
}

module.exports = distance
