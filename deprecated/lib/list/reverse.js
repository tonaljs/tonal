'use strict'

var list = require('./list')
/**
 * Get the reverse (retrograde) of a list
 *
 * @param {String|Array|Integer} list - the list to be reversed
 * @return {Array} The reversed list
 *
 * @example
 * reverse('A B C') // => ['C', 'B', 'A']
 */
function reverse (forward) {
  if (Array.isArray(forward)) return forward.concat().reverse()
  else return list(forward).reverse()
}

module.exports = reverse
