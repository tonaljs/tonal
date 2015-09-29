'use strict'

var harmonizer = require('../pitch/harmonizer')

/**
 * Create a collection of pitches by transposing a tonic by a collection of intervals
 *
 * This is a shortcut to create and invoke an harmonizer
 *
 * @param {String} tonic - the tonic
 * @param {String|Array} intervals - a collection of intervals
 * @param {boolean} pitchClassOnly - if true, the returned pitches don't include
 * octave information
 * @return {Array} a collection of pitches
 *
 * @see pitch/harmonizer
 *
 * @example
 * harmonize('C2', ['P1 P5']) // => ['C2', 'G2']
 */
function harmonize (tonic, intervals, pitchClassOnly) {
  return harmonizer(intervals)(tonic, pitchClassOnly)
}

module.exports = harmonize
