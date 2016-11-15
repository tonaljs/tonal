/**
 * Functions related to midi note numbers exclusively. This is not about midi
 * but about midi note numbers.
 *
 * @example
 * var midi = require('tonal-midi')
 * midi.fromNote('A4') // => 69
 * midi.toNote(69) // => 'A4'
 * midi.toNote(61) // => 'Db4'
 * midi.toNoteSharps(61) // => 'C#4'
 * midi.isValidNote(200) // false
 *
 * @module midi
 */

import parser from 'note-parser'

/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the thing to be tested
 * @return {Boolean} true if it's a valid midi note number
 * @example
 * midi.isValidNote(30) // => true
 * midi.isValidNote(200) // => false
 */
export function isValidNote (m) {
  return parser.midi(m) !== null
}

// To match the general midi specification where `C4` is 60 we must add 12 to
// `height` function:

/**
 * Get midi note number. If you pass a midi number it will be
 * bypassed.
 *
 * @param {Array|String} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi.fromNote('C4') // => 60
 * midi.fromNote(60) // => 60
 * midi.fromNote('60') // => 60
 */
export function fromNote (val) {
  if (Array.isArray(val) && val.length === 2) return val[0] * 7 + val[1] * 12 + 12
  return parser.midi(val)
}

var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ')

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @function
 * @param {Integer} midi - the midi note number
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} the note name
 * @example
 * var midi = require('tonal-midi')
 * midi.toNote(61) // => 'Db4'
 * midi.toNote(61, true) // => 'C#4'
 */
export function toNote (num, sharps) {
  if (num === true || num === false) return function (m) { return toNote(m, num) }
  var pcs = sharps === true ? SHARPS : FLATS
  var pc = pcs[num % 12]
  var o = Math.floor(num / 12) - 1
  return pc + o
}
