'use strict'

var keyNumber = require('./keyNumber')

/**
 * Given a key (number) returns the accidentals
 *
 * @example
 * accidentals('G major') // => '#'
 * accidentals('Eb minor') // => 'bbbbbb'
 * accidentals(3) // => '###'
 * accidentals(-2) // => 'bb'
 */
function accidentals (key) {
  var number = keyNumber(key)
  return Array(Math.abs(number) + 1).join(number < 0 ? 'b' : '#')
}

module.exports = accidentals
