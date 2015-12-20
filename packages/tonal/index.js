
function T () {}

T.notation = require('array-notation')
T.note = T.notation.note
T.interval = T.notation.interval
T.roman = T.notation.roman
T.pitch = T.notation.pitch
T.transpose = require('note-transpose')
T.note.transpose = T.transpose
T.note.interval = require('note-interval')

T.midi = T.note.midi = require('note-midi')
T.midi.freq = require('midi-freq')
T.gamut = require('music-gamut')
T.harmonizer = T.gamut.harmonizer

T.dictionary = require('music-dictionary')
T.scale = require('scale-dictionary')
T.chord = require('chord-dictionary')

module.exports = T
