'use strict'

var pitchSet = require('../set/pitchSet')
var interval = require('../pitch/interval')
var invert = require('../interval/invert')
var findByValue = require('../internal/findByValue')(require('./scales.json'))

/**
 * Given a pitch set return the scale name (if any)
 *
 * @param {Array|String} scale - the scale notes
 * ®return {String} the scale name or null if not found
 *
 * @example
 * name('C D E F G A B')
 */
function name (set) {
  set = pitchSet(set)
  var tonic = set[0]
  // TODO: find a better solution
  var intervals = set.map(function (pitch) { return interval(tonic, pitch) })
    .map(function (interval) {
      return /-/.test(interval) ? invert(interval, true) : interval
    })
  var name = findByValue(intervals.join(' '))
  return name ? tonic + ' ' + name : null
}



module.exports = name
