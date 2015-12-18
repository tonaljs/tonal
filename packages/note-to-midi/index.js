'use strict'

var parse = require('tonal.notation/note.parse')

/**
 * Get the midi number of a note
 *
 * If the argument passed to this function is a valid midi number, it returns it
 *
 * The note can be an string in scientific notation or
 * [array pitch notation](https://github.com/danigb/music.array.notation)
 *
 * @name midi
 * @function
 * @param {String|Array|Integer} note - the note in string or array notation.
 * If the parameter is a valid midi number it return it as it.
 * @return {Integer} the midi number
 *
 * @example
 * midi('A4') // => 69
 * midi('a3') // => 57
 * midi([0, 2]) // => 36 (C2 in array notation)
 * midi(60) // => 60
 */
function midi (note) {
  if ((typeof note === 'number' || typeof note === 'string') &&
    note > 0 && note < 128) return +note
  var p = Array.isArray(note) ? note : parse(note)
  if (!p || p.length < 2) return null
  return p[0] * 7 + p[1] * 12 + 12
}

if (typeof module === 'object' && module.exports) module.exports = midi
if (typeof window !== 'undefined') window.midi = midi
