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
function harmonize (tonic, intervals) {
  intervals = sequence(intervals, interval)
  if (!intervals) return null
  return intervals.map(transpose(tonic))
}

module.exports = harmonize
