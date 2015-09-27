'use strict'

var pitchSet = require('./pitchSet')
var rotate = require('../collection/rotate')

/**
 * Return all modes of a collection of notes
 *
 * @param {Array|String} pitchSet - the pitch set
 * @return {Array} an array of arrays with the set rotated set.length times
 *
 * @example
 * modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]
 */
function modes (collection) {
  var set = pitchSet(collection)
  return set.map(function (tonic, index) {
    return rotate(index, set)
  })
}

module.exports = modes
