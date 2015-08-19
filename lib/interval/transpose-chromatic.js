
var midi = require('../note/midi')
var fromMidi = require('../note/fromMidi')

function transposeChromatic (semitones, note) {
  return fromMidi(midi(note) + semitones)
}
module.exports = transposeChromatic
