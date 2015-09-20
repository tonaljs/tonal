'use strict'

var props = require('../pitch/props')

var LINE = 'FCGDAEB'

/**
 * Return the number of fifths between two pitches
 *
 * @param {String} pitch - the pitch to calc the distance to
 * @param {String} from - (Optional) the pitch to calc the distance from
 * (C if not specified)
 * @return {Integer} the step distance in the line of fifths
 *
 * @example
 * distance('C') // => 0
 * distance('G') // => 1
 * distance('D') // => 2
 * distance('F') // => -1
 * distance('Bb') // => -2
 * distance('A', 'D') // => 1
 */
function distance (pitch, from) {
  pitch = props(pitch)
  var mod = arguments.length === 1 ? 1 : distance(from) + 1
  var alter = pitch.alter * 7
  return LINE.indexOf(pitch.letter) + alter - mod
}

module.exports = distance
