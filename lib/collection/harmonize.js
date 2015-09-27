'use strict'

var toArray = require('../collection/toArray')
var transpose = require('../pitch/transpose')

/**
 * Create a collection of pitches by transposing a tonic by a collection of intervals
 *
 * @param {String} tonic - the tonic
 * @param {String|Array} intervals - a collection of intervals
 * @param {boolean} pitchClassOnly - if true, the returned pitches don't include
 * octave information
 * @return {Array} a collection of pitches
 *
 * @example
 * harmonize('C2', ['P1 P5']) // => ['C2', 'G2']
 */
function harmonize (tonic, intervals, pitchClassOnly) {
  var pitches = toArray(intervals).map(transpose(tonic))
  return pitchClassOnly ? pitches.map(pitchClass) : pitches
}

function pitchClass (pitch) { return pitch.slice(0, -1) }

module.exports = harmonize
