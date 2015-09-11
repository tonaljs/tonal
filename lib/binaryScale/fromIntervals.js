'use strict'

var list = require('../list/list')
var interval = require('../interval/interval')

/**
 * Return the binary representation of list of intervals
 *
 * @param {Array} intervals - an interval array
 */
function intervalsToBinary (intervals) {
  intervals = list(intervals, interval)
  if (!intervals) return null
  var tonic = intervals[0]
  var binary = new Uint8Array(12)
  intervals.forEach(function (p) { binary[(p.semitones - tonic.semitones) % 12] = 1 })
  return binary.join('')
}

module.exports = intervalsToBinary
