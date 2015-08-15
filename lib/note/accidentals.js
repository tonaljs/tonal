var parse = require('./parse')

/**
 * Return an accidentals of a note
 *
 * @param {String} note - the note
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
function accidentals (note) {
  return parse(note).acc
}

module.exports = accidentals
