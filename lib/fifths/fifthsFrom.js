'use strict'

var fifths = require('./fifths')

/**
 * Create a function to get fifths distance from a given note. Suited for
 * using with arrays of notes
 *
 * @param {String} from - the from note of the fifths distance
 * @return {function} the functtion to calculate distances
 *
 * @example
 * ['A', 'B', 'C'].map(fifthsFrom('G'))
 *
 */
function fifthsFrom (from) {
  return function (to) {
    return fifths(to, from)
  }
}

module.exports = fifthsFrom
