var parse = require('./parse')

// Semitones for C D E F G A B
var SEMITONES = [ 0, 2, 4, 5, 7, 9, 11 ]

/**
 * Get the midi number of a pitch
 *
 * @param {String} pitch - the pitch string
 * @param {Integer} octave - (Optional) the pitch octave (will override the
 * value from the pitch string)
 * @return {Integer} the midi number
 *
 * @example
 * toMidi('A4') // => 69
 * toMidi('A4', 3) // => 57
 */
function toMidi (pitch) {
  var t = parse(pitch)
  var oct = t[2] + 5
  return SEMITONES[t[0] - 1] + t[1] + 12 * oct
}

module.exports = toMidi
