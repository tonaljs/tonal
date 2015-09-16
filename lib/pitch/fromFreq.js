'use strict'

var fromMidi = require('./fromMidi')

/**
 * Given a frequency, get the pitch. It will round the frequency to the nearest
 * pitch frequency
 *
 * @param {Float} freq - the frequency
 * @return {String} the pitch
 *
 * @see cents
 */
function fromFreq (freq, tuning) {
  tuning = tuning || 440
  var lineal = 12 * ((Math.log(freq) - Math.log(tuning)) / Math.log(2))
  var midi = Math.round(69 + lineal)
  return fromMidi(midi)
}

module.exports = fromFreq
