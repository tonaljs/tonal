'use strict'

var pitch = require('./build')
var prop = require('../utils/prop')
/**
 * @name pitch
 * Get the scientific name of a pitch
 *
 * @param {String} pitch - the pitch to get the scientific name from
 * @return {String} the scientific nae of a pitch or null
 *
 * @example
 * pitch('a2') // => A2
 * pitch('bbb') // => Bbb4
 * pitch('c#') // => C#4
 */
module.exports = prop(pitch, 'pitch')
