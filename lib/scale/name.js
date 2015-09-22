'use strict'

var pitchSet = require('../pitchSet/pitchSet')
var toIntervals = require('../pitchSet/toIntervals')
var findByValue = require('../_internal/findByValue')(require('./scales.json'))

/**
 * Given a scale notes return the scale name (if any)
 *
 * @param {Array|String} scale - the scale notes
 * @return {String} the scale name or null if not found
 *
 * @example
 * name('C D E F G A B') // => 'C major'
 */
function name (scale) {
  var set = pitchSet(scale)
  var tonic = set[0]
  var name = findByValue(toIntervals(set).join(' '))
  return name ? tonic + ' ' + name : null
}


module.exports = name
