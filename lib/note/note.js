var parse = require('./parse')
var accidentals = require('./accidentals')

/**
 * Create a note and return its connonical representation
 *
 * The cannonical representation of a note in tonal is a string with a
 * step (in upper case), accidentals (with '#' or 'b', never 'x') and a octave
 * number (a positive decimal, always present)
 *
 * @param {String} note or step - a string with a note or a strp
 * @param {Integer} alteration - (Optional) the alteration number. If not set
 * uses the alterations from the note (if present) or 0
 * @param {Integer} octave - (Optional) the note octave. If note set uses the
 * octave from the note (if present) or 4
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
  return note.step + acc + oct
}

module.exports = note
