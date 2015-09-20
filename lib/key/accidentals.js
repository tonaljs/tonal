'use strict'

var keyNumber = require('./keyNumber')
var acc = require('../pitch/alterToAcc')

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
  return acc(keyNumber(key))
}

module.exports = accidentals
