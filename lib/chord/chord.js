'use strict'

var dictionary = require('./data/dictionary')
var harmonize = require('../interval/harmonize')

/**
 * Get a chord from a chord name. The chord is an array of pitches or intervals
 * depending if a tonic is given or not.
 *
 * @param {String} name - the chord name (may include the tonic)
 * @param {String} tonic - (Optional) the tonic pitch
 * @return {Array} an array of intervals or notes (if the tonic is provided)
 *
 * @example
 * chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
 * chord('7b5') // => ['1P', '3M', '5d', '7m']
 * chord('7b5', 'Bb2')
 */
function chord (tonic, name) {
  if (arguments.length === 1) return chord(null, tonic)

  var intervals = dictionary(name)
  if (!intervals) return null

  return tonic ? harmonize(tonic, intervals) : intervals
}

module.exports = chord
