'use strict'

var transpose = require('../pitch/transpose')

/**
 * Get an harmonizer for a list of intervals. An harmonizer is a function that
 * _harmonizes_ a pitch: given a pitch returns a collection of pitches.
 *
 * The harmonizer is a function with the signature `<String> => {Array}`, where
 * the string parameter is the pitch and the array is an array of pitches. If
 * no pitch is provided, it returns an array of intervals (see @example)
 *
 * Harmonizer are the basic construction blocks of scales and chords.
 *
 * @param {Array} intervals - the intervals array
 * @param {boolean} pitchClassOnly - (Optional) if true, the harmonizer will
 * return pitchClasses (no octaves) instead of full pitches
 * @return {Function} the harmonizer function
 *
 * @example
 * var major = harmonizer(['1P', '3M', '5M'])
 * major('C') // => ['C4', 'E4', 'G4']
 * major('C', true) // => ['C', 'E', 'G'] (pitch classes only)
 * major() // => ['1P', '3M', '5M']
 */
function harmonizer (intervals, pitchClassOnly) {
  return function (tonic) {
    if (!tonic) return intervals
    var pitches = intervals.map(transpose(tonic))
    return pitchClassOnly ? pitches.map(pitchClass) : pitches
  }
}

function pitchClass (pitch) { return pitch.slice(0, -1) }

module.exports = harmonizer
