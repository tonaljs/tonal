'use strict'

var scale = require('./scale')
var pitchSet = require('../pitchSet/pitchSet')
var toIntervals = require('../pitchSet/toIntervals')

/**
 * Given collection of pitches return the scale name (if any)
 *
 * @param {Array|String} pitches - the pitches collection
 * @return {String} the scale name or null if not found
 *
 * @example
 * name('C D E F G A B') // => 'C major'
 */
function name (pitches) {
  var set = pitchSet(pitches)
  var intervals = toIntervals(set).join()
  var tonic = set[0]
  var name = scale(function (s) {
    return s.join() === intervals
  })[0]

  return name ? tonic + ' ' + name : null
}

module.exports = name
