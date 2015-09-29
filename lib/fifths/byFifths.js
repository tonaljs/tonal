'use strict'

var distance = require('./distance')

/**
 * Get a comparator function to sort a collection of pitch classes by
 * distance distance in fifths to a base (or C4)
 *
 * @param {String} from - (Optional) the base pitch
 * @return {Function} a comparator function
 *
 * @example
 * ['C#', 'G#', 'F#'].sort(byFifths()) // => ['F#', 'C#', 'D#']
 */
function byFifths (base) {
  return function (a, b) {
    return distance(a, base) - distance(b, base)
  }
}

module.exports = byFifths
