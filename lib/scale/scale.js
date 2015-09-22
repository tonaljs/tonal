'use strict'

var harmonize = require('../interval/harmonize')
var generic = require('./intervals')

/**
 * Get the scale (pitch set) of a scale name
 *
 * If the scale name does not contains the tonic, a list of intervals is returned
 *
 * @param {String} name - the scale name
 * @param {String} tonic - (Optional) the tonic
 * @return {Array} an array of intervals or notes (if tonic is present)
 *
 * @example
 * scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
 * scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
 */
function scale (name, tonic) {
  var intervals = generic(name)
  if (intervals) return tonic ? harmonize(tonic, intervals, true) : intervals

  var space = name.indexOf(' ')
  if (space < 0) return null
  return scale(name.slice(space + 1), tonic || name.slice(0, space))
}

module.exports = scale
