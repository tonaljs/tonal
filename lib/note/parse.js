var REGEX = /^([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(\d*)$/
var SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/**
 * Parse a note and return its properties
 *
 * It returns an object with the following properties:
 * - __step__: the step letter __always__ in uppercase
 * - __acc__: a string with the accidentals or '' if no accidentals (never null)
 * - __oct__: a integer with the octave. If not present in the note, is set to 4
 * - __alter__: the integer representic the accidentals (0 for no accidentals,
 * -1 for 'b', -2 for 'bb', 1 for '#', 2 for '##', etc...)
 * - __pc__: the [pitch class](https://en.wikipedia.org/wiki/Pitch_class#Integer_notation)
 * of the note. The pitch class is an integer value between 0 and 11
 * where C=0, C#=1, D=2...B=11
 *
 * @param {String} note - the note (pitch) to be p
 * @return an object with the note components or null if its not a valid note
 *
 * @example
 * parse('C#2') // => { }
 */
function parse (string, namePrefix) {
  var m = REGEX.exec(string)
  if (!m) return null

  var note = { str: m[0], step: m[1].toUpperCase(),
    acc: m[2].replace(/x/g, '##'), oct: m[3] === '' ? 4 : +m[3] }
  note.alter = note.acc[0] === '#' ? note.acc.length : -note.acc.length
  note.pc = SEMITONES[note.step] + note.alter
  return note
}

module.exports = parse
