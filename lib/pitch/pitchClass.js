'use strict'

var parse = require('./parse')
var pitchStr = require('./pitchStr')

/**
 * Get the [pitchClass](https://en.wikipedia.org/wiki/Pitch_class) of a pitch
 *
 * @name pitchClass(pitch)
 * @param {String} pitch - the pitch to get the pitchClass number from
 * @return {Interger} the pitchClass number or null if not a valid pitch
 *
 * @example
 * pitchClass('a4') // => 'A'
 * pitchClass('ab') // => 'Ab'
 * pitchClass('cx2') // => 'C##'
 */
module.exports = function pitchClass (pitch) {
  pitch = parse(pitch)
  return pitch ? pitchStr(pitch, true) : null
}
