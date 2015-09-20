'use strict'

var fifths = require('./fifths')

/**
 * Get a comparator function to sort a collection of pitch classes
 *
 * @param {String} from - (Optional) the base pitch
 * @return {Function} a comparator function
 *
 * @example
 * ['A', 'B', 'C'].sort(byFifths()) // =>
 */
function byFifths (base) {
  return function (a, b) {
    return fifths(a, base) - fifths(b, base)
  }
}

module.exports = byFifths
