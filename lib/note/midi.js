var parse = require('./parse')

/**
 * Get the midi number of the given note
 *
 * @param {String} note - the note
 * @return {Integer} - the midi number
 *
 * @example
 * var midi = require('tonal/note/midi')
 * midi('A4') // => 69
 */
function midi (note) {
  note = parse(note)
  if (!note) return null
  return note.pc + 12 * (note.oct + 1)
}

module.exports = midi
