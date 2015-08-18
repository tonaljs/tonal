'use strict'

var parse = require('./parse')

/**
 * Return an accidentals of a note
 *
 * @param {String} note - the note
 * @param {String} accidentals - if present, returns a note with the given
 * accidentals
 * @return {String} an accidentals string
 *
 * @see misc/accidentals
 *
 * @example
 * var accidentals = require('tonal/note/accidentals')
 * accidenals('C#4') // => '#'
 * accidenals('Db') // => 'b'
 * accidenals('E') // => ''
 */
function accidentals (note, accidentals) {
  note = parse(note)
  if (arguments.length === 1) return note.acc
  else return note.step + accidentals + note.oct
}

module.exports = accidentals
