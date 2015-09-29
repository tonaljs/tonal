'use strict'

var distance = require('./distance')

/**
 * Create a function to get distance in fifths from a given note.
 *
 * @param {String} from - the from note of the distance distance
 * @return {function} the functtion to calculate distances
 *
 * @example
 * ['A', 'B', 'C'].map(distanceFrom('G'))
 *
 */
function distanceFrom (from) {
  return function (to) {
    return distance(to, from)
  }
}

module.exports = distanceFrom
