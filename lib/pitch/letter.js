'use strict'

var props = require('./props')

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
function letter (letter, number) {
  var p = props(letter)
  if (!p) return null
  if (!number) return p.letter
  var code = ((p.letter.charCodeAt(0) - 65) + number) % 7
  return String.fromCharCode(code + 65)
}

module.exports = letter
