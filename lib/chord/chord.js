'use strict'

var harmonize = require('../interval/harmonize')
var parse = require('./parse')
var intervals = require('./intervals')

/**
 * Get chord notes or intervals by its type and (optionally) tonic pitch
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
  var chord = parse(name)
  if (!chord) return null

  chord.tonic = tonic || chord.tonic
  if (!chord.tonic) return intervals(chord.type)
  return harmonize(chord.tonic, intervals(chord.type))
}

module.exports = chord
