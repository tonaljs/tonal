'use strict'

var harmonize = require('../interval/harmonize')
var parse = require('./parse')
var generic = require('./generic')

/**
 * Get the scale (pitch set) of a scale name
 *
 * If the scale name does not contains the tonic, a list of intervals is returned
 *
 * @param {String} name - the scale name
 * @return {Array} an array of intervals or notes (if tonic is present)
 *
 * @example
 * scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
 * scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
 */
function scale (name) {
  name = parse(name)
  if (!name) return null

  var intervals = generic(name.type)
  if (!intervals) return null
  else if (!name.tonic) return intervals
  else return harmonize(name.tonic, intervals, true)
}

module.exports = scale
