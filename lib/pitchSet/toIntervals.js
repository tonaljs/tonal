var interval = require('../pitch/interval')
var invert = require('../interval/invert')

/**
 * Get the intervals of a pitch set
 *
 * @param {Array} set - the pitch set
 * @return {Array} the intervals of the pitch set (starting from 1P)
 *
 * @example
 * toIntervals(['C', 'D', 'Eb']) // => ['1P', '2M', '3m']
 */
function toIntervals (set) {
  var tonic = set[0]
  return set.map(function (pitch) { return interval(tonic, pitch) })
  .map(function (interval) {
    return /-/.test(interval) ? invert(interval, true) : interval
  })
}

module.exports = toIntervals
