'use strict'

var parse = require('./parse')

/**
 * Get the octave of a pitch
 *
 * @name octave
 * @param {String} pitch - the pitch to get the octave from
 * @return {Interger} the octave number or null if not a valid pitch
 *
 * @example
 * octave('a4') // => 4
 */
module.exports = function octave (pitch) {
  var p = parse(pitch)
  return p ? p[2] + 4 : null
}
