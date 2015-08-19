var parse = require('../note/parse')

var STEPS = {'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6}

/**
 * Get the generic interval distance between two notes
 *
 * @module interval
 *
 * @example
 * distanceGeneric('C', 'G') // => 4
 * distanceGeneric('G', 'C') // => -4
 */
function distanceGeneric (root, dest) {
  return STEPS[parse(dest).step] - STEPS[parse(root).step]
}
module.exports = distanceGeneric
