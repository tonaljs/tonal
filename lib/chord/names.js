'use strict'

var list = require('../list/list')
var fromPitches = require('../binaryScale/fromPitches')
var fromIntervals = require('../binaryScale/fromIntervals')
var data = require('./chords-all.json')
var index = null

/**
 * Get the chord name(s) of a given pitches
 */
function names (pitches) {
  if (!index) buildIndex()
  var binary = fromPitches(pitches)
  var names = index[binary]
  if (!names) return []
  var tonic = list(pitches)[0]
  return names.map(function (name) { return tonic + name })
}

function buildIndex () {
  index = []
  Object.keys(data).forEach(function (name) {
    var binary = fromIntervals(data[name])
    index[binary] = index[binary] || []
    index[binary].push(name)
  })
  return index
}

module.exports = names
