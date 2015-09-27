'use strict'

var dictionary = require('./data/dictionary')
var pitchSet = require('../pitchSet/pitchSet')
var toIntervals = require('../pitchSet/toIntervals')

/**
 * Given collection of pitches return the scale name (if any)
 *
 * @param {Array|String} pitches - the pitches collection
 * @return {String} the scale name or null if not found
 *
 * @example
 *  find('C D E F G A B') // => 'C major'
 */
function find (pitches) {
  var set = pitchSet(pitches)
  var intervals = toIntervals(set).join()
  var tonic = set[0]
  var find = dictionary(function (s) {
    return s.join() === intervals
  })[0]

  return find ? tonic + ' ' + find : null
}

module.exports = find
