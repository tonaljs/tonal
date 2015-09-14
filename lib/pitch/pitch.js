var props = require('./props')

var ACCIDENTALS = { '-4': 'bbbb', '-3': 'bbb', '-2': 'bb', '-1': 'b',
  0: '', 1: '#', 2: '##', 3: '###', 4: '####'}

/**
 * Get the scientific notation of a pitch from a pitch and optional octave and
 * alteration. The octave and alteration will override the ones from the pitch
 *
 * @param {String} pitch - a pitch, a pitch class or a pitch letter
 * @param {String|Integer} alteration - (Optional) the alteration number
 * (overrides the one from the pitch string). Can be null to avoid overrides
 * @param {Integer} octave - (Optional) the octave (overrides the one from the pitch string)
 * @return {String} the pitch in scientific notation or null if not valid pitch
 *
 * @example
 * pitch('c') // => 'C4'
 * pitch('c', '#') // => 'C#4'
 * pitch('c', '#', 2) // => 'C#2'
 * pitch('c#4') // => 'C#4'
 * pitch('C#4', 'b', 2) // => 'Cb2'
 * pitch('C#4', null, 2) // => 'C#2'
 * pitch('C7', -1) // => 'Cb7'
 * pitch('bluf') // => null
 */
function pitch (pitch, acc, oct) {
  pitch = props(pitch)
  if (!pitch) return null
  if (arguments.length === 1) return pitch.str

  oct = oct ? oct : pitch.oct

  if (!acc) acc = pitch.acc
  else if (acc > -5 && acc < 5) acc = ACCIDENTALS[acc]
  else if (/^#{0,4}$/.test(acc) || /^b{0,4}$/.test(acc)) acc = acc
  else return null

  // if not valid acc parameter return null
  if (acc === null) return null

  return pitch.letter + acc + oct
}

module.exports = pitch
