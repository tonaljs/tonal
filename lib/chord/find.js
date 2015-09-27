'use strict'

var toArray = require('../collection/toArray')
var binarySet = require('../binarySet/binarySet')
var data = require('./data/chords.json')
var index = null

/**
 * Get the chord name(s) of a given pitches
 */
function find (pitches) {
  if (!index) buildIndex()
  var binary = binarySet(pitches)
  var name = index[binary]
  if (!name) return null
  var tonic = toArray(pitches)[0]
  return tonic + name
}

function buildIndex () {
  index = []
  Object.keys(data).forEach(function (name) {
    var binary = binarySet(data[name])
    index[binary] = name
  })
  return index
}

module.exports = find
