var props = require('./props')

var ACCIDENTALS = { '-4': 'bbbb', '-3': 'bbb', '-2': 'bb', '-1': 'b',
  0: '', 1: '#', 2: '##', 3: '###', 4: '####'}

/**
 * Build a pitch properties object from a string and (optionally) the octave
 * and/or accidentals
 *
 * The parameters of octave and accidentals overrides the values of the pitch string
 *
 * @param {String} pitch - a pitch, a pitch class or a pitch letter
 * @param {Integer} octave - (Optional) the octave.
 * @param {Integer} alteration - (Optional) the alteration number
 * @return {Object} an object with the pitch properties
 *
 * @example
 * build('Db3') // properties of 'Db3'
 * build('C4', 2) // properties of 'C2'
 * build('G', 1, 1) // properties of 'G#1'
 * build('G', null, 2) // properties of 'G##4'
 * build('C##', 3, -1) // properties of 'Cb3'
 */
function build (pitch, oct, acc) {
  pitch = props(pitch)
  if (!pitch) return null
  if (arguments.length === 1) return pitch

  oct = oct ? oct : pitch.oct
  acc = acc ? ACCIDENTALS[acc] : pitch.acc
  // if not valid acc parameter return null
  if (acc === null) return null

  return props(pitch.letter + acc + oct)
}

module.exports = build
