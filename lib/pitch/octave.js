'use strict'

var pitch = require('./props')
var prop = require('../utils/prop')
/**
 * @name octave
 * Get the octave of a pitch
 *
 * @param {String} pitch - the pitch to get the octave from
 * @return {Interger} the octave number or null if not a valid pitch
 *
 * @example
 * octave('a4') // => 4
 */
module.exports = prop(pitch, 'oct')
