'use strict'

var set = require('./set')
/**
 * Get the reverse (retrograde) of a set
 *
 * @param {String|Array|Integer} set - the set to be reversed
 * @return The reversed set
 *
 * @example
 * reverse('A B C') // => ['C', 'B', 'A']
 */
function reverse (forward) {
  return set(forward).concat().reverse()
}

module.exports = reverse
