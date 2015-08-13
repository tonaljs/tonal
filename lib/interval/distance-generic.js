var step = require('../note/step')

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
  return step(dest).charCodeAt(0) - step(root).charCodeAt(0)
}
module.exports = distanceGeneric
