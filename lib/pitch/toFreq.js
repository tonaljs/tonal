'use strict'

var toMidi = require('./toMidi')
// decimal number
var NUM = /^\d+(?:\.\d+)?$/

/**
 * Get the pitch frequency in hertzs
 *
 * @param {String} pitch - the pitch
 * @param {Integer} tuning - optional tuning, 440 by default
 * @return {Float} - the pitch frequency
 *
 * @example
 * toFreq('A4') // => 440
 * toFreq('A3', 444) // => 222
 */
function toFreq (pitch, tuning) {
  if (NUM.test(pitch)) return +pitch
  var midi = toMidi(pitch)
  if (!midi) return null
  tuning = tuning || 440
  return Math.pow(2, (midi - 69) / 12) * tuning
}

module.exports = toFreq
