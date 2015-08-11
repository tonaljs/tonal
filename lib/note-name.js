'use strict'

var parse = require('./parse-note')

/**
 * Get the note name of a note represented in [scientific notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 *
 * The note name is the [pitch class](https://en.wikipedia.org/wiki/Pitch_class)
 * of the note (__always__ in uppercase) with the alterations (the octave is ignored)
 *
 * If the note given is not a valid note, an exception is thrown
 *
 * @param {String} note - the note to get the name of
 * @return {String} the note name
 */
function noteName (note) {
  note = parse(note)
  return note.pc + note.acc
}

module.exports = noteName
