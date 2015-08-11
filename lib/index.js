'use strict'

var tonal = {
  cycleOfFifths: require('./cycle-of-fifths'),
  cycle: require('./cycle'),
  distance: require('./distance'),
  enharmonics: require('./enharmonics'),
  freq: require('./freq'),
  intervalClass: require('./interval-class'),
  intervalNames: require('./interval-names'),
  intervalNumber: require('./interval-number'),
  invertInterval: require('./invert-interval'),
  isScaleBinaryNumber: require('./is-scale-binary-number'),
  keySignature: require('./key-signature'),
  noteFromMidi: require('./note-from-midi'),
  midi: require('./midi'),
  noteName: require('./note-name'),
  parseInterval: require('./parse-interval'),
  parseNote: require('./parse-note'),
  pitchClass: require('./pitch-class'),
  transpose: require('./transpose')
}

module.exports = tonal
