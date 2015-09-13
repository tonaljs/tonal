'use strict'

var REGEX = /^([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(\d*)$/
var SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/**
 * Get pitch properties
 *
 * It returns an object with the following properties:
 *
 * - __name__: the propsd pitch string
 * - __letter__: the pitch letter __always__ in uppercase
 * - __pitchClass__: the pitch [pitch class](https://en.wikipedia.org/wiki/Pitch_class)
 * (letter in uppercase, accidentals using 'b' or '#', never 'x', no octave)
 * - __acc__: a string with the accidentals or '' if no accidentals (never null)
 * - __oct__: a integer with the octave. If not present in the pitch, is set to 4
 * - __alter__: the integer representic the accidentals (0 for no accidentals,
 * - __midi__: {Integer} the midi value
 * -1 for 'b', -2 for 'bb', 1 for '#', 2 for '##', etc...)
 * - __chroma__: {Integer} the pitch class interger value (between 0 and 11)
 * where C=0, C#=1, D=2...B=11
 *
 * @param {String} pitch - the pitch to get the properties from
 * @return an object with the pitch components or null if its not a valid pitch
 *
 * @example
 * props('C#2') // => { }
 */
function props (pitch) {
  var m = REGEX.exec(pitch)
  if (!m) return null

  var n = { name: m[0] }
  n.letter = m[1].toUpperCase()
  n.acc = m[2].replace(/x/g, '##')
  n.pitchClass = n.letter + n.acc
  n.oct = m[3] === '' ? 4 : +m[3]
  n.sci = n.pitchClass + n.oct

  // numeric derived data
  n.alter = n.acc[0] === 'b' ? -n.acc.length : n.acc.length
  n.chroma = SEMITONES[n.letter] + n.alter
  n.midi = n.chroma + 12 * (n.oct + 1)
  return n
}

var memoize = require('../utils/fastMemoize')
var coerce = require('../utils/coerceParam')
module.exports = coerce('name', memoize(props))
