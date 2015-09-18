'use strict'

var toArray = require('../_internal/toArray')
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
  var binary = zeros(12)
  distances.forEach(function (p) { binary[(p - tonic + 12) % 12] = 1 })
  return binary.join('')
}

function zeros (len) {
  var arr = []
  while (len--) arr.push(0)
  return arr
}

module.exports = toBinary
