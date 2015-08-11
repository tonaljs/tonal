var parse = require('./parse-note')
var PITCHCLASSES = 'CDEFGABCDEFGAB'

/**
 * Return the pitch class of a note modified by a number of steps
 *
 * @param {String|Note} note - the note to get the pitch class or a pitch class
 * letter. If a note is given the accidentals and octave are ignored
 * @param {Integer} steps - the number of steps to be raised or lowel the pitch class
 * @return {String} a uppercase letter with the pitch class
 *
 * @example
 * var pitchClass = require('tonal/pitch-class')
 * pitchClass('C', 3) // => 'E'
 * pitchClass('D', -2) // => 'B'
 * pitchClass('db4', 2) // => 'F'
 */
function pitchClass (note, number) {
  note = parse(note)
  var index = PITCHCLASSES.indexOf(note.pc)
  var dest = index + ((number - 1) % 7)
  if (dest < 0) dest += 9
  return PITCHCLASSES[dest]
}

module.exports = pitchClass
