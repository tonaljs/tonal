'use strict'

var toList = require('./toList')
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
  return toList(forward).reverse()
}

module.exports = reverse
