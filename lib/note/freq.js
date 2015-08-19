var midi = require('./midi')

/**
 * Get the note frequency in hertzs
 *
 * @param {String} note - the note
 * @param {Integer} tuning - optional tuning, 440 by default
 * @return {Float} - the note frequency
 *
 * @example
 * var freq = require('tonal/freq')
 * freq('A4') // => 440
 * freq('A3', 444) // => 222
 */
function freq (note, tuning) {
  var m = midi(note)
  if (!m) return null
  tuning = tuning || 440
  return Math.pow(2, (m - 69) / 12) * tuning
}

module.exports = freq
