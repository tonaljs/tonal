'use strict'

// map from pitch number to number of fifths and octaves
var BASES = [ [0, 0], [2, -1], [4, -2], [-1, 1], [1, 0], [3, -1], [5, -2] ]

/**
 * Get a pitch in array format from properties
 *
 * @name props.array
 * @function
 * @param {Array} prop - the pitch in property format
 * @return {Array} the pitch in array format
 */
module.exports = function (p) {
  var base = BASES[p[0]]
  if (p.length === 2) return [base[0] + 7 * p[1]]
  return [p[3] * (base[0] + 7 * p[1]), p[3] * (p[2] + base[1] - 4 * p[1])]
}
