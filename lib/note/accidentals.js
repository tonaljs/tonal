var parse = require('./parse')

/**
 * Return an accidentals of a note
 *
 * @param {String} note - the note
 * @return {String} an accidentals string
 * @see misc/accidentals
 *
 * @example
 * var accidentals = require('tonal/note/accidentals')
 * accidenals('C#4') // => '#'
 * accidenals('Db') // => 'b'
 * accidenals('E') // => ''
 */
function accidentals (value) {
  if (value === 0) return ''
  else if (/^-\d+$/.test(value)) return repeat('b', Math.abs(value))
  else if (/^\d+$/.test(value)) return repeat('#', value)
  else return parse(value)[1]
}

module.exports = accidentals

function repeat (char, num) { return Array(num + 1).join(char) }
