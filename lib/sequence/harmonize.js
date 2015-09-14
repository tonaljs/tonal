'use strict'

var toArray = require('../utils/toArray')
var transpose = require('../pitch/transpose')

/**
 * Create a pitch sequence from a sequence of intervals
 *
 * @param {String} tonic - the tonic pitch
 * @param {String|Array} intervals - a sequence of intervals
 * @return {Array} a sequence of pitches
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
