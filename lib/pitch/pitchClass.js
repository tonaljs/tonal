'use strict'

var pitch = require('./props')
var prop = require('../utils/prop')
/**
 * @name pitchClass
 * Get the [pitchClass](https://en.wikipedia.org/wiki/Pitch_class) of a pitch
 *
 * @param {String} pitch - the pitch to get the pitchClass number from
 * @return {Interger} the pitchClass number or null if not a valid pitch
 *
 * @example
 * pitchClass('a4') // => 69
 */
module.exports = prop(pitch, 'pitchClass')
