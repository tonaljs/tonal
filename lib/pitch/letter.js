'use strict'

var parse = require('./parse')
var LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/**
 * Get the letter of a pitch (and optionally move a number of steps)
 *
 * @param {String} pitch - the pitch to get the letter from
 * @param {Integer} steps - (Optional) the number of steps to move
 * @return {String} a pitch letter
 *
 * @example
 * letter('c#5') // => 'C'
 * letter('c', 0) // => 'C'
 * letter('c', 1) // => 'D'
 * letter('c', 2) // => 'E'
 */
function letter (pitch, number) {
  var p = parse(pitch)
  if (!p) return null
  var i = number ? (p[0] + number - 1) % 7 : p[0] - 1
  return LETTERS[i]
}

module.exports = letter
