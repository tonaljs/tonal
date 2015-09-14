'use strict'

var toArray = require('../utils/toArray')
var semitones = require('../interval/semitones')

/**
 * Return the binary representation of sequence of intervals
 *
 * @param {Array} intervals - an interval array
 */
function intervalsToBinary (intervals) {
  var iss = toArray(intervals).map(semitones)
  if (!iss) return null
  var tonic = iss[0]
  var binary = new Uint8Array(12)
  iss.forEach(function (p) { binary[(p - tonic) % 12] = 1 })
  return binary.join('')
}

module.exports = intervalsToBinary
