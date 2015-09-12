'use strict'

var interval = require('../interval/interval')
var sequence = require('../sequence/sequence')
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
  intervals = sequence(intervals, interval)
  if (!intervals) return null
  var pitches = intervals.map(transpose(tonic))
  return pitchClassOnly ? pitches.map(pitchClass) : pitches
}

function pitchClass (pitch) { return pitch.slice(0, -1) }

module.exports = harmonize
