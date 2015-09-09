var props = require('./props')

var ACCIDENTALS = { '-4': 'bbbb', '-3': 'bbb', '-2': 'bb', '-1': 'b',
  0: '', 1: '#', 2: '##', 3: '###', 4: '####'}

/**
 * Get a pitch properties from a string and optionally change the octave or the
 * accidentals
 *
 * @param {String} pitch - a string with a step letter and optinally
 * aaccidentals and octave number
 * @param {Integer} octave - (Optional) the pitch octave.
 * @param {Integer} alteration - (Optional) the alteration number
 * @return {Object} an object with the pitch properties (@see pitch/props)
 *
 * @module pitch
 *
 * @example
 * pitch('Db3') // properties of 'Db3'
 * pitch('C4', 2) // properties of 'C2'
 * pitch('G', 1, 1) // properties of 'G#1'
 * pitch('G', null, 2) // properties of 'G##4'
 * pitch('C##', 3, -1) // properties of 'Cb3'
 */
function pitch (pitch, oct, acc) {
  pitch = props(pitch)
  if (!pitch) return null

  oct = oct ? oct : pitch.oct
  acc = acc ? ACCIDENTALS[acc] : pitch.acc
  // if not valid acc parameter return null
  if (acc === null) return null

  return props(pitch.letter + acc + oct)
}

module.exports = pitch
