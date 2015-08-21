var parse = require('./parse')

/**
 * Normalize a note
 *
 * TODO: docs
 *
 * @example
 * normalize('Cx') // => 'C##4'
 */
function normalize (note) {
  note = parse(note)
  return note ? note.step + note.acc + note.oct : null
}

module.exports = normalize
