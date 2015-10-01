'use strict'

var dictionary = require('./data/chords')
var harmonize = require('../pitch/harmonize')
var IMPLICIT = /^([a-gA-G](?:#{1,4}|b{1,4}|x{1,2}|))(.*)$/

/**
 * Get a chord from a chord name. The chord is an array of pitches or intervals
 * depending if a tonic is given or not.
 *
 * @param {String} tonic - (Optional) the tonic pitch
 * @param {String} name - the chord name (may include the tonic)
 * @return {Array} an array of intervals or notes (if the tonic is provided)
 *
 * @example
 * chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
 * chord('C', 'Maj7') // => ['C4', 'E4', 'G4', 'B4']
 * chord('7b5') // => ['1P', '3M', '5d', '7m']
 * chord(null, '7b5') // => ['1P', '3M', '5d', '7m']
 */
function chord (tonic, name) {
  if (arguments.length === 1) return chord(null, tonic)

  var intervals = dictionary(name)
  if (!intervals) {
    var m = IMPLICIT.exec(name)
    return (m && dictionary(m[2])) ? chord(tonic || m[1], m[2]) : null
  }

  return tonic ? harmonize(tonic, intervals) : intervals
}

module.exports = chord
