'use strict'

var pitch = require('./props')
var prop = require('../_internal/prop')
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
module.exports = prop(pitch, 'pitchClass')
