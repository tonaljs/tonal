var interval = require('../pitch/interval')
var invert = require('../interval/invert')

/**
 * Get the intervals of a collection of pitches starting from a tonic
 *
 * @param {Array} collection - the pitch collection
 * @return {Array} the intervals of the pitch collection (starting from 1P)
 *
 * TODO: better implementation, tests
 *
 * @example
 * toIntervals(['C', 'D', 'Eb']) // => ['1P', '2M', '3m']
 */
function toIntervals (collection) {
  var tonic = collection[0]
  return collection.map(function (pitch) { return interval(tonic, pitch) })
  .map(function (interval) {
    return /-/.test(interval) ? invert(interval, true) : interval
  })
}

module.exports = toIntervals
