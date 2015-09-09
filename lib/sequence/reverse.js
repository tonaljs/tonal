'use strict'

var sequence = require('./sequence')

/**
 * Get the reverse (retrograde) of a sequence
 *
 * @param {String|Array} sequence - the sequence to be reversed
 * @return {Array} The reversed sequence
 *
 * @example
 * reverse('A B C') // => ['C', 'B', 'A']
 */
function reverse (forward) {
  if (Array.isArray(forward)) return forward.concat().reverse()
  else return sequence(forward).reverse()
}

module.exports = reverse
