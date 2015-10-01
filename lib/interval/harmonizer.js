'use strict'

var toArray = require('../collection/toArray')
var transpose = require('../pitch/transpose')

/**
 * Get an harmonizer for a list of intervals. An harmonizer is a function that
 * _harmonizes_ a pitch: given a pitch returns a collection of pitches.
 *
 * The returned function receives two parameters:
 * - {String} pitch - the pitch to be harmonized
 * - {boolean} pitchClassesOnly - set true to get only pitch classes
 *
 * Harmonizer are the basic construction blocks of scales and chords.
 *
 * @see pitch/harmonize
 *
 * @example
 * var major = harmonizer(['1P', '3M', '5M'])
 * major('C') // => ['C4', 'E4', 'G4']
 * major('C', true) // => ['C', 'E', 'G'] (pitch classes only)
 * major() // => ['1P', '3M', '5M']
 */
function harmonizer (intervals) {
  intervals = toArray(intervals)
  return function (tonic, pitchClassOnly) {
    if (!tonic) return intervals
    var pitches = intervals.map(transpose(tonic))
    return pitchClassOnly ? pitches.map(pitchClass) : pitches
  }
}

function pitchClass (pitch) { return pitch.slice(0, -1) }

module.exports = harmonizer
