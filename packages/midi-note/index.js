'use strict'

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ]

/**
 * Get the note name (in scientific notation) of the given midi number
 *
 * It uses MIDI's [Tuning Standard](https://en.wikipedia.org/wiki/MIDI_Tuning_Standard)
 * where A4 is 69
 *
 * This method doesn't take into account diatonic spelling. Always the same
 * pitch class is given for the same midi number.
 *
 * @name midi.note
 * @function
 * @param {Integer} midi - the midi number
 * @return {String} the pitch
 *
 * @example
 * var note = require('midi-note')
 * note(69) // => 'A4'
 */
module.exports = function (midi) {
  if (isNaN(midi) || midi < 0 || midi > 127) return null
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  return name + oct
}
