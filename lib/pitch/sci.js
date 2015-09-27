var props = require('./props')

var ACCIDENTALS = { '-4': 'bbbb', '-3': 'bbb', '-2': 'bb', '-1': 'b',
  0: '', 1: '#', 2: '##', 3: '###', 4: '####'}

/**
 * Get the scientific representation of a given pitch (or null if its not a valid
* pitch).

* If not given, the octave is 4 by default. You can override the alteration
* and/or octave with optionals parameters
 *
 * @param {String} pitch - a pitch, a pitch class or a pitch letter
 * @param {String|Integer} alteration - (Optional) the alteration number
 * (overrides the one from the pitch string). Can be null to avoid overrides
 * @param {Integer} octave - (Optional) the octave (overrides the one from the pitch string)
 * @return {String} the pitch in scientific notation or null if not valid pitch
 *
 * @example
 * sci('c') // => 'C4'
 * sci('c', '#') // => 'C#4'
 * sci('c', '#', 2) // => 'C#2'
 * sci('b#4') // => 'B#4'
 * sci('C#4', 'b', 2) // => 'Cb2'
 * sci('C#4', null, 2) // => 'C#2'
 * sci('C7', -1) // => 'Cb7'
 * sci('bluf') // => null
 */
function sci (pitch, acc, oct) {
  pitch = props(pitch)
  if (!pitch) return null
  if (arguments.length === 1) return pitch.sci

  oct = oct ? oct : pitch.oct

  if (!acc) acc = pitch.acc
  else if (acc > -5 && acc < 5) acc = ACCIDENTALS[acc]
  else if (/^#{0,4}$/.test(acc) || /^b{0,4}$/.test(acc)) acc = acc
  else return null

  // if not valid acc parameter return null
  if (acc === null) return null

  return pitch.letter + acc + oct
}

module.exports = sci
