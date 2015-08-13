
var midi = require('../note/midi')
var fromMidi = require('../note/from-midi')

function transposeChromatic (semitones, note) {
  return fromMidi(midi(note) + semitones)
}
module.exports = transposeChromatic
