'use strict'

var props = require('../pitch/props')
var acc = require('../pitch/alterToAcc')

var LINE = 'FCGDAEB'

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
  pitch = props(pitch)
  number = LINE.indexOf(pitch.letter) + number

  var letter, oct
  if (number >= 0) {
    letter = number % 7
    oct = Math.floor(number / 7)
  } else {
    letter = (7 + number % 7) % 7
    oct = -Math.floor(-number / 7) - 1
  }
  return LINE.charAt(letter) + acc(pitch.alter + oct)
}

module.exports = transpose
