'use strict'

var harmonize = require('../interval/harmonize')
var generic = require('./intervals')
var TONIC = /^\s*([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(.*)$/

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
function chord (name, tonic) {
  var intervals = generic(name)
  if (intervals) return tonic ? harmonize(tonic, intervals) : intervals

  var split = TONIC.exec(name)
  if (!split) return null
  return chord(split[3].trim(), tonic || split[1] + split[2])
}

module.exports = chord
