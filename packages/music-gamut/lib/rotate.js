'use strict'

var split = require('./split')
/**
 * Rotate the gamut
 *
 * @name gamut.rotate
 * @function
 * @param {Integer} count - the number of rotations
 * @param {String|Array} gamut - a list of notes or intervals
 * @return {Array} the gamut rotated count times
 *
 * @example
 * var rotate = require('music.kit/gamut/rotate')
 * rotate(1, 'C D E') // => ['D', 'E', 'C']
 */
module.exports = function (count, source) {
  var g = split(source)
  var len = g.length
  var n = ((count % len) + len) % len
  return g.slice(n, len).concat(g.slice(0, n))
}
