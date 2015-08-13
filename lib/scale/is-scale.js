'use strict'

// restricted version of an interval
var SCALE_INTERVAL = /^[dmPMA][1-8]$/
/**
 * Determine if a given scale is a valid scale
 *
 * @param {String} intervals - the array of intervals to test
 * @return {boolean} true if its a valid scale intervals array
 */
function isScale (intervals) {
  if (!Array.isArray(intervals)) return false
  if (intervals[0] !== 'P1') return false
  for (var i = 0, total = intervals.length; i < total; i++) {
    if (!SCALE_INTERVAL.test(intervals[i])) return false
  }
  return true
}

module.exports = isScale
