'use strict'

var sequence = require('./sequence')

/**
 * Rotate a sequence
 *
 * @param {String|Array} sequence - the sequence to rotate
 * @param {Integer} times
 * @return {Array} the rotated sequence
 *
 * @example
 * rotate('A B C', 1) // => ['B', 'C', 'A']
 */
function rotate (seq, times) {
  seq = sequence(seq)
  times = times || 0
  times = times % seq.length
  return seq.slice(times).concat(seq.slice(0, times))
}

module.exports = rotate
