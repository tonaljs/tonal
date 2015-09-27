var toArray = require('./toArray')
var interval = require('../pitch/interval')
var invert = require('../interval/invert')

/**
 * Get the intervals of a collection of pitches starting from a tonic
 *
 * @param {Array} pitches - the pitch collection
 * @return {Array} the intervals
 *
 * TODO: better implementation, tests
 *
 * @example
 * intervals(['C', 'D', 'Eb']) // => ['1P', '2M', '3m']
 * intervals('Bb', ['C', 'D', 'Eb']) // => ['2M', '3M', '4P']
 */
function intervals (tonic, pitches) {
  if (arguments.length === 1) {
    pitches = toArray(tonic)
    return intervals(pitches[0], pitches)
  }

  return toArray(pitches)
    .map(function (pitch) {
      return interval(tonic, pitch)
    }).map(function (interval) {
    return /-/.test(interval) ? invert(interval, true) : interval
  })
}

module.exports = intervals
