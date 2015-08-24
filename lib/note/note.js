var parse = require('./parse')
var accidentals = require('./accidentals')

/**
 * Create a note from its components (letter, octave, alteration)
 *
 * It returns the cannonical representation of a note (ie. 'C##2', 'Db3')
 * In tonal it means a string with:
 * - letter (in upper case)
 * - accidentals (with '#' or 'b', never 'x')
 * - a octave number (a positive decimal, always present)
 *
 * @param {String} note or step - a string with a note or a note letter
 * @param {Integer} alteration - (Optional) the alteration number. If not set
 * uses the alterations from the note (if present) or 0
 * @param {Integer} octave - (Optional) the note octave. If note set uses the
 * octave from the note (if present) or 4
 * @return {Object} an object with the note properties (@see note/parse)
 *
 * @module note
 *
 * @example
 * note('D', -2, 3) // => 'Dbb3'
 * note('G', 2, 1) // => 'G##1'
 * note('C', 1) // => 'C#4'
 * note('C##', -1) // => 'Cb4'
 * note('Cx') // => 'C##4'
 * note('Cx', null, 2) // => 'C##2'
 */
function note (note, acc, oct) {
  note = parse(note)
  if (!note) return null

  acc = acc ? accidentals(acc) : note.acc
  oct = oct ? oct : note.oct
  return parse(note.letter + acc + oct)
}

module.exports = note
