
var STEP = '([a-gA-G])'
var ACC = '(#{0,4}|b{0,4}|x{0,2})'
var OCT = '(-?[0-9]{0,1})'
var NOTE = new RegExp('^' + STEP + ACC + OCT + '$')
var NAME_PREFIX = new RegExp('^' + STEP + ACC + '()')

/**
 * Get the components of a note (step, accidentals and octave)
 *
 * It returns an object with the following properties:
 * - step: the step letter __always__ in uppercase
 * - acc: a string with the accidentals or '' if no accidentals (never null)
 * - oct: a integer with the octave. If not present in the note, is set to 4
 *
 * @param {String} note - the note (pitch) to be parsed
 * @param {boolean} namePrefix - if name prefix is true, then a note name
 * (without octave) is extracted from the beggining of the string
 * @return an object with the note components
 */
function parse (note, namePrefix) {
  var m = (namePrefix ? NAME_PREFIX : NOTE).exec(note)
  if (!m) throw Error('Invalid note: ' + note)
  return { note: m[0], step: m[1].toUpperCase(),
    acc: m[2].replace(/x/g, '##'), oct: m[3] ? +m[3] : 4 }
}

module.exports = parse
