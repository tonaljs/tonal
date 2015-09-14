var props = require('./props')

var ACCIDENTALS = { '-4': 'bbbb', '-3': 'bbb', '-2': 'bb', '-1': 'b',
  0: '', 1: '#', 2: '##', 3: '###', 4: '####'}

/**
 * Build a pitch with a pitch letter, octave and alteration
 *
 * The parameters of octave and accidentals overrides the values of the pitch string
 *
 * @param {String} pitch - a pitch, a pitch class or a pitch letter
 * @param {Integer} octave - (Optional) the octave.
 * @param {Integer} alteration - (Optional) the alteration number
 * @return {Object} an object with the pitch properties
 *
 * @example
 * pitch('c') // => 'C4'
 * pitch('c', 1) // => 'C1'
 * pitch('C4', 2) // => 'C2'
 * pitch('Db3') // => 'Db3'
 * pitch('G', 1, 1) // => 'G#1'
 * pitch('G', null, 2) // => 'G##4'
 * pitch('C##', 3, -1) // => 'Cb3'
 */
function pitch (pitch, oct, acc) {
  pitch = props(pitch)
  if (!pitch) return null
  if (arguments.length === 1) return pitch.str

  oct = oct ? oct : pitch.oct
  acc = acc ? ACCIDENTALS[acc] : pitch.acc
  // if not valid acc parameter return null
  if (acc === null) return null

  return pitch.letter + acc + oct
}

module.exports = pitch
