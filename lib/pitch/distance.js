'use strict'

var midi = require('./toMidi')

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
  var fromMidi = midi(from)
  var toMidi = midi(to)
  if (!fromMidi || !toMidi) return null
  return toMidi - fromMidi
}

module.exports = distance
