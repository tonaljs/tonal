'use strict'

var toArray = require('./toArray')

/**
 * Rotate a collection
 *
 * @param {Integer} times
 * @param {String|Array} array - the source (se toArray)
 * @return {Array} the rotated array
 *
 * @example
 * rotate(1, 'A B C') // => ['B', 'C', 'A']
 */
function rotate (times, coll) {
  coll = toArray(coll)
  times = times % coll.length
  return coll.slice(times).concat(coll.slice(0, times))
}

module.exports = rotate
