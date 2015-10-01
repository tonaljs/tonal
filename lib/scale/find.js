'use strict'

var scales = require('./data/scales')
var names = Object.keys(require('./data/scale-intervals.json'))
var pitchSet = require('../collection/pitchSet')
var toIntervals = require('../collection/intervals')

/**
 * Get the scale name of a pitch set. The pitch set must contain all the
 * pitches of the scale
 *
 * @param {Array|String} pitches - the pitches collection
 * @return {String} the scale name or null if not found
 *
 * @example
 *  find('C D E F G A B') // => 'C major'
 */
function find (pitches) {
  var set = pitchSet(pitches)
  var tonic = set[0]
  var intervals = toIntervals(set).join('')
  var found = names.filter(function (name) {
    return scales[name].join('') === intervals
  }).map(function (name) {
    return tonic + ' ' + name
  })

  return found[0]
}

module.exports = find
