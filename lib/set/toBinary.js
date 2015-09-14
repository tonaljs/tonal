'use strict'

var toArray = require('../internal/toArray')
var semitones = require('../interval/semitones')
var midi = require('../pitch/midi')

/**
 * Return the binary set representation of a collection of intervals
 *
 * @param {Array} intervals - an interval array
 */
function toBinary (source) {
  var collection = toArray(source)
  var distances = collection.map(midi)
  if (distances[0] === null) distances = collection.map(semitones)
  var tonic = distances[0]
  var binary = new Uint8Array(12)
  distances.forEach(function (p) { binary[(p - tonic + 12) % 12] = 1 })
  return binary.join('')
}

module.exports = toBinary
