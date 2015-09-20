'use strict'

var props = require('../pitch/props')

var LINE = 'FCGDAEB'

/**
 * Return the number of fifths between two pitch classes.
 *
 * @param {String} pitch - the pitch to calc the fifths distance to
 * @param {String} from - (Optional) the pitch to calc the fifths distance from
 * (C if not specified)
 * @return {Integer} the number fifths between the two pitches
 *
 * @example
 * fifths('C') // => 0
 * fifths('G') // => 1
 * fifths('D') // => 2
 * fifths('F') // => -1
 * fifths('Bb') // => -2
 * fifths('A', 'D') // => 1
 * fifths('C4', 'C2') // => 0
 */
function fifths (pitch, from) {
  pitch = props(pitch)
  var mod = from ? fifths(from) : 0
  if (pitch === null || mod === null) return null

  var alter = pitch.alter * 7
  return LINE.indexOf(pitch.letter) + alter - mod - 1
}

module.exports = fifths
