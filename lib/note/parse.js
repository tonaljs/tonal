
var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?[0-9]{0,1})$/

/**
 * Get the components of a note (step, accidentals and octave)
 *
 * It returns an object with the following properties:
 * - step: the step letter __always__ in uppercase
 * - acc: a string with the accidentals or '' if no accidentals (never null)
 * - oct: a integer with the octave. If not present in the note, is set to 4
 *
 * @param {String} note - the note (pitch) to be parsed
 * @return an object with the note components
 */
function parse (note) {
  var m = NOTE.exec(note)
  if (!m) throw Error('Invalid note: ' + note)
  return { step: m[1].toUpperCase(), acc: m[2], oct: m[3] ? +m[3] : 4 }
}

module.exports = parse
