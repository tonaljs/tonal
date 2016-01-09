'use strict'

var str = require('./str')
var parse = require('./parse')

/**
 * Get a pitch from a string. In tonal a pitch it's a note, an interval or a
 * pitch class. It allows us to work with this elements in an uniform way.
 *
 * @name pitch
 * @function
 * @param {String} source - the string
 * @return {String} the pitch or null if not a valid pitch
 *
 * @example
 * var pitch = require('music-notation/pitch/pitch')
 * pitch('c2') // => 'C2'
 * pitch('2') // => '2M'
 * pitch('blah') // => null
 *
 * @deprecated use pitch/index
 */
module.exports = function (s) {
  return str(parse(s))
}
