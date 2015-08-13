var distanceGeneric = require('./distance-generic')
var distanceChromatic = require('./distance-chromatic')
var genericToDiatonic = require('./generic-to-diatonic')

/**
 * Get the interval between two notes
 *
 * @param {String} root - root or tonic note
 * @param {String} destination - the destination note
 * @return {String} an interval
 */
function distanceInterval (root, dest) {
  return genericToDiatonic(distanceGeneric(root, dest), distanceChromatic(root, dest))
}

module.exports = distanceInterval
