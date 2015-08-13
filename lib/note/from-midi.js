'use strict'

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]

/**
 * Get the note of the given midi number
 *
 * This method doesn't take into account diatonic spelling. Always the same
 * pitch class is given to the same midi number. @see enahrmonic
 *
 * @param {Integer} midi - the midi number
 * @return {String} the note or null if there's no pitchClass available to this note name
 *
 */
function fromMidi (midi) {
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  return name + oct
}

module.exports = fromMidi
