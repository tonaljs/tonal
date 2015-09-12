'use strict'

var sequence = require('../sequence/sequence')
var fromPitches = require('../binary-scale/fromPitches')
var fromIntervals = require('../binary-scale/fromIntervals')
var data = require('./chords.json')
var index = null

/**
 * Get the chord name(s) of a given pitches
 */
function name (pitches) {
  if (!index) buildIndex()
  var binary = fromPitches(pitches)
  var name = index[binary]
  if (!name) return null
  var tonic = sequence(pitches)[0]
  return tonic + name
}

function buildIndex () {
  index = []
  Object.keys(data).forEach(function (name) {
    var binary = fromIntervals(data[name])
    index[binary] = name
  })
  return index
}

module.exports = name
