'use strict'

var parse = require('./parse-note')

/**
 * Get the note name of a note represented in [scientific notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 *
 * The note name is the [pitch class](https://en.wikipedia.org/wiki/Pitch_class)
 * of the note (__always__ in uppercase) with the alterations (the octave is ignored)
 */
function noteName(note) {
  note = parse(note)
  return note.pc + note.acc
}

module.exports = noteName
