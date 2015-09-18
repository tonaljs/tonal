'use strict'

var pitch = require('./props')
var prop = require('../_internal/prop')
/**
 * Get the midi of a pitch
 *
 * @name midi(pitch)
 * @param {String} pitch - the pitch to get the midi number from
 * @return {Interger} the midi number or null if not a valid pitch
 *
 * @example
 * midi('a4') // => 69
 */
module.exports = prop(pitch, 'midi')
