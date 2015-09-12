var parse = require('./parse')
var FIFTHS = 'C G D A E B F# C# G# D# A# E# F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb'.split(' ')
var LEN = 11

/**
 * Given a key (`C major` for example), get the key number. The key number is the
 * number of sharps (if positive number) or flats (if the number is negative) of
 * the key
 *
 * The name can be a pitch class (and major key is supposed), a pitch class with
 * a 'major' or 'minor' appended, or a string with the accidentals
 *
 * @param {String} name - the name of the key
 * @return {Integer} the key number (number of alterations)
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

  var index = FIFTHS.indexOf(name.tonic)
  if (index === -1) return null

  // its in the negative area
  if (index > LEN) index = -1 * (index - LEN)
  // its minor...
  if (name.type === 'minor') index -= 3

  return index
}

module.exports = keyNumber
