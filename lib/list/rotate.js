'use strict'

var list = require('./list')

/**
 * Rotate a list
 *
 */
function rotate (seq, times) {
  seq = list(seq)
  times = times || 0
  times = times % seq.length
  return seq.slice(times).concat(seq.slice(0, times))
}

module.exports = rotate
