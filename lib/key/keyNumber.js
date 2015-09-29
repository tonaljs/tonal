'use strict'

var parse = require('./parse')
var fifths = require('../fifths/distance')

/**
 * Get the key number (the number of sharps or flats) of a key
 *
 * The name can be a pitch class (and major key is supposed), a pitch class with
 * a 'major' or 'minor' appended, or a string with the accidentals
 *
 * @param {String} key - the key (name, pitch or accidentals)
 * @return {Integer} the key number (alteration number)
 *
 * @example
 * keyNumber('G major') // => 1
 * keyNumber('F major') // => -1
 * keyNumber('C') // => 0
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
