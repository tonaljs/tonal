
var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?[0-9]{0,1})$/

/**
 * Parse a note (or more exactly, a pitch: a step and, optionally, accidentals
 * and octave)
 *
 * It returns an array with:
 * - __step__: the step letter __always__ in uppercase
 * - __accidentals__: a string with the accidentals or '' if no accidentals
 * - __octave__: a integer with the octave. If not present is set to 4
 *
 * This is a low level method and should __not__ be used (@see pitch/name,
 * @see pitch/step ...)
 *
 * @api private
 * @param {String} note - the note (pitch) to be parsed
 * @return an array in the form [step, accidentals, octave]
 */
function parse (note) {
  var m = NOTE.exec(note)
  if (!m) throw Error('Invalid note: ' + note)
  return [m[1].toUpperCase(), m[2], m[3] ? +m[3] : 4]
}

module.exports = parse
