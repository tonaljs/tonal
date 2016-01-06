'use strict'

/**
 * Build an accidentals string from alteration number
 *
 * @name accidentals.str
 * @param {Integer} alteration - the alteration number
 * @return {String} the accidentals string
 *
 * @example
 * var accidentals = require('music-notation/accidentals/str')
 * accidentals(0) // => ''
 * accidentals(1) // => '#'
 * accidentals(2) // => '##'
 * accidentals(-1) // => 'b'
 * accidentals(-2) // => 'bb'
 */
module.exports = function (num) {
  if (num < 0) return Array(-num + 1).join('b')
  else if (num > 0) return Array(num + 1).join('#')
  else return ''
}
