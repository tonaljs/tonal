'use strict'

var set = require('./pitchSet')
var rotate = require('../collection/rotate')

/**
 * Return all modes of a pitch set
 *
 * @param {Array|String} pitchSet - the pitch set
 * @return {Array} an array of arrays with the set rotated set.length times
 *
 * @example
 * modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]
 */
function modes (pitchSet) {
  pitchSet = set(pitchSet)
  return pitchSet.map(function (tonic, index) {
    return rotate(index, pitchSet)
  })
}

module.exports = modes
