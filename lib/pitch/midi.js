'use strict'

var pitch = require('./build')
var prop = require('../utils/prop')
/**
 * @name midi
 * Get the midi of a pitch
 *
 * @param {String} pitch - the pitch to get the midi number from
 * @return {Interger} the midi number or null if not a valid pitch
 *
 * @example
 * midi('a4') // => 69
 */
module.exports = prop(pitch, 'midi')
