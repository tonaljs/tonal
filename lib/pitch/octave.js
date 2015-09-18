'use strict'

var pitch = require('./props')
var prop = require('../_internal/prop')
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
module.exports = prop(pitch, 'oct')
