'use strict'

var dictionary = require('./intervals')
var harmonize = require('../collection/harmonize')
var IMPLICIT = /^([a-gA-G](?:#{1,4}|b{1,4}|x{1,2}|))\s+(.*)$/

/**
 * Get the scale (a set of intervals or pitch classes) with a given name and
 * optionally a tonic
 *
 * If the scale name does not contains the tonic, a list of intervals is returned
 *
 * @param {String} tonic - (Optional) the tonic
 * @param {String} name - the scale name
 * @return {Array} an array of intervals or notes (if tonic is present)
 *
 * @example
 * scale('C', 'major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * scale('D', 'diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
 * scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
 */
function scale (tonic, name) {
  if (arguments.length === 1) return scale(null, tonic)

  var intervals = dictionary(name)
  if (!intervals) {
    var m = IMPLICIT.exec(name)
    return m && dictionary(m[2]) ? scale(m[1], m[2]) : null
  }
  return tonic ? harmonize(tonic, intervals, true) : intervals
}

module.exports = scale
