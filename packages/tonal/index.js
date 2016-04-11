
function assign (dest, src) {
  Object.keys(src).forEach(function (key) { dest[key] = src[key] })
}

function T () {}

T.notation = require('music-notation')
T.note = T.notation.note
T.pitchClass = require('pitch-class')

/**
 * @name interval
 * @function
 */
T.interval = T.notation.interval
T.interval.simplify = require('interval-simplify')

T.roman = T.notation.roman
T.pitch = T.notation.pitch

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
T.harmonizer = require('note-harmonizer')
T.note.harmonize = T.harmonize = T.harmonizer

/**
 * Get the interval between two notes
 * An alias for `note.interval`
 *
 * @name distance
 * @function
 */
T.distance = T.note.interval = require('note-interval')
T.note.enharmonics = require('enharmonics')

/**
 * Convert from note name to midi number
 * An alias for `midi`
 *
 * @name note.midi
 * @function
 */
T.midi = T.note.midi = require('note-midi')

T.note.freq = require('note-freq')
T.midi.freq = require('midi-freq')

/**
 * Convert from midi to note number
 * An alias for `midi.note`
 * @name note.fromMidi
 * @function
 */
T.midi.note = T.note.fromMidi = require('midi-note')

T.sort = require('pitch-sort')
T.noteFilter = require('note-filter')

/**
 * Sort a collection of notes or intervals in ascending order
 *
 * @name sortAsc
 * @function
 */
T.sortAsc = T.sort(true)
/**
 * Sort a collection of notes or intervals in descending order
 *
 * @name sortDesc
 * @function
 */
T.sortDesc = T.sort(false)

assign(T, require('music-gamut'))
T.pitchSet = require('pitch-set')

T.scale = require('music-scale')
T.chord = require('music-chord')

module.exports = T
