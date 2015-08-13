var pc = require('../note/pitch-class')

/**
 * Get the distance in semitones between two notes
 *
 * @param {String} root - the root note
 * @param {String} destination - the destination note
 *
 * @module interval
 *
 * @example
 * distanceChromatic('C', 'G') // => 7
 * distanceChromatic('G', 'C') // => -7
 */
function distanceChromatic (root, dest) {
  return pc(dest) - pc(root)
}
module.exports = distanceChromatic
