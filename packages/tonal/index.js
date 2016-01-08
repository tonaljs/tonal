
function T () {}

T.notation = require('music-notation')
T.note = T.notation.note
T.interval = T.notation.interval
T.roman = T.notation.roman
T.pitch = T.notation.pitch

T.pitchSet = require('pitch-set')

/**
 * Transpose a note by an interval
 * An alias for `transpose`
 *
 * @name note.transpose
 * @function
 */
T.note.transpose = T.transpose = require('note-transposer')

/**
 * Harmonizes a note by an interval list
 * An alias for `harmonize`
 *
 * @name note.harmonize
 * @function
 */
T.note.harmonize = T.harmonize = require('note-harmonizer')

T.note.interval = require('note-interval')
T.note.enharmonics = require('enharmonics')

/**
 * Convert from note name to midi number
 * An alias for `midi`
 *
 * @name note.midi
 * @function
 */
T.midi = T.note.midi = require('note-midi')

T.midi.freq = require('midi-freq')

/**
 * Convert from midi to note number
 * An alias for `midi.note`
 * @name note.fromMidi
 * @function
 */
T.midi.note = T.note.fromMidi = require('midi-note')

T.gamut = require('music-gamut')
T.harmonizer = T.gamut.harmonizer

T.dictionary = require('music-dictionary')
T.scale = require('music-scale')
T.chord = require('music-chord')

module.exports = T
