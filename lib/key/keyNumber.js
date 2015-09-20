'use strict'

var parse = require('./parse')
var fifths = require('../fifths/fifths')

/**
 * Given a key (`C major` for example), get the key number. The key number is the
 * number of sharps (if positive number) or flats (if the number is negative) of
 * the key
 *
 * The name can be a pitch class (and major key is supposed), a pitch class with
 * a 'major' or 'minor' appended, or a string with the accidentals
 *
 * @param {String} key - the key (can be the name or the accidentals)
 * @return {Integer} the key number (alteration number)
 *
 * @example
 * keyNumber('C major') // => 0
 * keyNumber('G') // => 1
 * keyNumber('Eb minor') // => -6
 * keyNumber('##') // => 2
 * keyNumber('bbb') // => -3
 */
function keyNumber (name) {
  if (/^-?\d+$/.test(name)) return name
  else if (/^#+$/.test(name)) return name.length
  else if (/^b+$/.test(name)) return -1 * name.length

  name = parse(name)
  if (!name) return null

  var index = fifths(name.tonic)
  if (name.type === 'minor') index -= 3

  return index
}

module.exports = keyNumber
