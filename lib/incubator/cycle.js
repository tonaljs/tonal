'use strict'

var transpose = require('../pitch/transpose')

/**
 * Create a collection of pitches by repeating a interval transposition a number of times
 *
 * @param {String} tonic - the pitch to begin with (is the first pitch of the
 * collection if the offset is 0)
 * @param {String} interval - the interval used to tranpose
 * @param {Integer} length - the length of the resulting collection (1 by default)
 * @param {Integer} offset - the number of notes to be skipped before build the
 * collection (0 by default)
 *
 * @example
 * cycle('C', 'P5', 5) // => ['C4', 'G4', 'D5', 'A5', 'E6']
 */
function cycle (tonic, interval, length, offset) {
  length = length || 1
  offset = offset || 0
  var result = []
  var current = transpose(tonic, '1P').slice(0, -1)
  for (var i = 0, len = length + offset; i < len; i++) {
    result.push(current)
    current = transpose(current, interval).slice(0, -1)
  }
  return result.slice(offset)
}

module.exports = cycle
