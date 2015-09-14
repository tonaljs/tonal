'use strict'

var toArray = require('../utils/toArray')

/**
 * Rotate an array
 *
 * @see utils/toArray
 *
 * @param {String|Array} array - the source (se toArray)
 * @param {Integer} times
 * @return {Array} the rotated array
 *
 * @example
 * rotate('A B C', 1) // => ['B', 'C', 'A']
 */
function rotate (seq, times) {
  seq = toArray(seq)
  times = times || 0
  times = times % seq.length
  return seq.slice(times).concat(seq.slice(0, times))
}

module.exports = rotate
