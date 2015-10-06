'use strict'

var parse = require('../pitch/parse')
var acc = require('../pitch/alterToAcc')
var FIFTHS = [4, 1, 5, 2, 6, 3, 7]
var LETTERS = 'FCGDAEB'

/**
 * Transpose a pitch class by a number of fifths
 *
 * @param {String} pitchClass - the pitch class to be transposed
 * @param {Integer} number - the number of fifths (can be negative)
 * @return {String} the transposed pitch class
 *
 * @example
 * transpose('C', 2) // => 'D'
 * transpose('C5', -2) // => 'Bb'
 */
function transpose (pitch, number) {
  pitch = parse(pitch)
  number = FIFTHS.indexOf(pitch[0]) + number

  var letter, oct
  if (number >= 0) {
    letter = number % 7
    oct = Math.floor(number / 7)
  } else {
    letter = (7 + number % 7) % 7
    oct = -Math.floor(-number / 7) - 1
  }
  return LETTERS.charAt(letter) + acc(pitch[1] + oct)
}

module.exports = transpose
