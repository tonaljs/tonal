'use strict'

var toArray = require('../_internal/toArray')
var semitones = require('../interval/semitones')
var midi = require('../pitch/midi')

/**
 * Get the binary set number of a collection of pitches or intervals
 *
 * @param {Array|String} collection - a collection of pitches or intervals
 * @return {String} a binary number
 *
 * @example
 * toBinary('C D') // => '101000000000'
 * toBinary('C4 D8') // => '101000000000'
 * toBinary('1P 2M') // => '101000000000'
 * toBinary('1P 9M') // => '101000000000'
 * toBinary('1P 7M') // => '100000000001'
 */
function toBinary (source) {
  var collection = toArray(source)
  var distances = collection.map(midi)
  if (distances[0] === null) distances = collection.map(semitones)
  var tonic = distances[0]
  var binary = array(12, 0)
  distances.forEach(function (p) { binary[(p - tonic + 12) % 12] = 1 })
  return binary.join('')
}

// create an array of length `len` filled with `value`
function array (len, value) {
  var arr = []
  while (len--) arr.push(value)
  return arr
}

module.exports = toBinary
