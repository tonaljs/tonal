'use strict'

var props = require('./props')
/**
 * Get the distance in semitones between to pitches
 *
 * @param {String} from - the first pitch
 * @param {String} to - the destination pitch
 * @return {Integer} the number of semitones (can be negative)
 *
 * @example
 * distance('C4', 'D5') // => 14
 * distance('A', 'G') // => -2
 */
function distance (from, to) {
  from = props(from)
  to = props(to)
  if (!from || !to) return null
  return to.midi - from.midi
}

module.exports = distance
