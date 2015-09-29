'use strict'

var pitchSet = require('../collection/pitchSet')
var rotate = require('../collection/rotate')
var fromCollection = require('../binaryScale/fromCollection')
var dictionary = require('./intervals')

/**
 * Get the chord name(s) of a collection of pitches
 *
 * @param {String|Array} pitches - the pitch collection
 * @return {Array} an array of the chord names that has that pitches
 *
 * @example
 * find('G2 E3 C4') // => ['CM/G', 'Em#5/G']
 */
function find (pitches) {
  var set = pitchSet(pitches)
  var inversions = {}
  set.forEach(function (tonic, index) {
    inversions[tonic] = fromCollection(rotate(index, set))
  })
  var results = []
  set.forEach(function (tonic) {
    results = results.concat(dictionary(function (intervals) {
      return fromCollection(intervals) === inversions[tonic]
    }).map(function (name) {
      return tonic + name
    }))
  })
  return results
}

module.exports = find
