'use strict'

var distance = require('./distance')

/**
 * Get a comparator function to sort pitches by frequency
 *
 * @param {boolean} descending - (Optional) true to sort descending
 * @return {Function} a comparator function
 *
 * @example
 * ['G', 'E', 'A', 'D'].sort(byFreq()) // => ['D', 'E', 'G', 'A']
 */
function byFreq (descending) {
  return function (a, b) {
    return descending ? distance(a, b) : distance(b, a)
  }
}

module.exports = byFreq
