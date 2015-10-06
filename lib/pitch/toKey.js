'use strict'
var toMidi = require('./toMidi')

/**
 * Get the key number from a pitch
 *
 * @param {String} pitch - the pitch
 * @return {Integer} the key number
 *
 * @example
 * toKey(49) // => 'A4'
 */
function toKey (pitch) {
  var midi = toMidi(pitch)
  return midi ? midi - 20 : null
}

module.exports = toKey
