'use strict'

var dictionary = require('./intervals')
var pitchSet = require('../collection/pitchSet')
var toIntervals = require('../collection/intervals')

/**
 * Get the scale name(s) of a collection of pitches
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
