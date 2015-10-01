'use strict'

var toArray = require('./collection/toArray')

function tonal (source) {
  return toArray(source)
}

tonal.sci = require('./pitch/sci')
tonal.pitchClass = require('./pitch/pitchClass')
tonal.octave = require('./pitch/octave')

tonal.toMidi = require('./pitch/toMidi')
tonal.fromMidi = require('./pitch/fromMidi')
tonal.toFreq = require('./pitch/toFreq')
tonal.fromFreq = require('./pitch/fromFreq')

tonal.transpose = require('./pitch/transpose')
tonal.interval = require('./pitch/interval')

tonal.scale = require('./scale/scale')
tonal.scale.find = require('./scale/find')
tonal.scale.names = require('./scale/names')

tonal.chord = require('./chord/chord')
tonal.chord.find = require('./chord/find')
tonal.chord.names = require('./chord/names')

tonal.harmonize = require('./pitch/harmonize')
tonal.intervals = require('./collection/intervals')
tonal.pitchSet = require('./collection/pitchSet')
tonal.modes = require('./collection/modes')

module.exports = tonal
