'use strict'

var enharmonics = require('./enharmonics')

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]
function midiNoteName (midi, pitchClass) {
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  return pitchClass ? enharmonics(name + oct, pitchClass)[0] : name + oct
}

module.exports = midiNoteName
