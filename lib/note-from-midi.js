'use strict'

var enharmonics = require('./enharmonics')

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]

/**
 * Get the note of the given midi number
 *
 * Since there are several names for each number, optionally you can choose
 * the pitch class of the enharmonics
 *
 * @param {Integer} midi - the midi number
 * @param {String} pitchClass - desired pitch class. (Optional, must be uppercase)
 * @return {String} the note or null if there's no pitchClass available to this note name
 *
 */
function noteFromMidi (midi, pitchClass) {
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  return pitchClass ? enharmonics(name + oct, pitchClass)[0] : name + oct
}

module.exports = noteFromMidi
