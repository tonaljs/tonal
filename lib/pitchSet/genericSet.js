var interval = require('../pitch/interval')
var invert = require('../interval/invert')

/**
 * Get the intervals of a pitch set
 *
 * @example
 * toIntervals()
 */
function toIntervals (set) {
  var tonic = set[0]
  return set.map(function (pitch) { return interval(tonic, pitch) })
  .map(function (interval) {
    return /-/.test(interval) ? invert(interval, true) : interval
  })
}

module.exports = toIntervals
