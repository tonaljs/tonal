'use strict'

var sequence = require('./sequence')

/**
 * Rotate a sequence
 *
 */
function rotate (seq, times) {
  seq = sequence(seq)
  times = times || 0
  times = times % seq.length
  return seq.slice(times).concat(seq.slice(0, times))
}

module.exports = rotate
