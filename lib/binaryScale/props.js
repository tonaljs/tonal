'use strict'

var isValid = require('./isValid')

/**
 * Get the properties of a binary scale.
 *
 * The returned object has the following attributes:
 * - binary: a binary scale number
 * - decimal: decimal equivalent to the binary representation
 * - length: the number of notes of this scale
 * - steps: an array with the distance in semitones between the notes of the scale
 * - leap: the maximum distance between notes of the scale
 *
 * @param {String} binary - the binary scale number
 * @return {Array} an array with the distances
 *
 * @example
 * props('101011010101').decimal // => 2773 (major scale)
 * props('101011010101').length // => 7
 * props('101011010101').distances // => [ 2, 2, 1, 2, 2, 2, 1 ]
 * props('101011010101').leap // => 7
 */
function props (binary) {
  if (!isValid(binary)) return null
  var distances = binary.match(/1(0)*/g).map(function (o) { return o.length })

  return {
    decimal: parseInt(binary, 2),
    length: binary.match(/1/g).length,
    distances: distances,
    leap: Math.max.apply(Math, distances)
  }
}

module.exports = props
