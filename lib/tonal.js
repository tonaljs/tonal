'use strict'

var toArray = require('./internal/toArray')

function tonal (source) {
  return toArray(source)
}

tonal.pitch = require('./pitch/pitch')
tonal.pitchClass = require('./pitch/pitchClass')
tonal.octave = require('./pitch/octave')
tonal.freq = require('./pitch/freq')
tonal.midi = require('./pitch/midi')
tonal.fromMidi = require('./pitch/fromMidi')
tonal.transpose = require('./pitch/transpose')
tonal.interval = require('./pitch/interval')

tonal.scale = require('./scale/scale')
tonal.modes = require('./set/modes')

module.exports = tonal
