'use strict'

var set = require('tonal.set/fromBinary')
var key = require('./parse')
var SCALES = [ 2773, 2902, 3418, 2741, 2774, 2906, 3434 ]

/**
 * @name key.scale
 * @function
 *
 * @example
 * key.scale('C major') // => ['C', 'D', 'E', ...]
 */
module.exports = function (name) {
  var k = key(name)
  if (!k) return []
  return set(SCALES[k.dist - 1], k.tonic)
}
