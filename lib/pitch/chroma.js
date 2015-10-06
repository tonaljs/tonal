'use strict'

var parse = require('./parse')
var SEMITONES = [null, 0, 2, 4, 5, 7, 9, 11]

/**
 * Get chroma of a pitch. The chroma is the integer notation of a pitch class
 *
 * @name chroma
 * @param {String} pitch - the pitch to get the chorma from
 * @return {Integer} the chroma
 *
 * @example
 * chroma('C') // => 0
 * chroma('B#') // => 0
 * chroma('Dbb') // => 0
 */
module.exports = function chroma (pitch) {
  var p = parse(pitch)
  return p ? (SEMITONES[p[0]] + p[1] + 12) % 12 : null
}
