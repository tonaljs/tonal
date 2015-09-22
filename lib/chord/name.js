'use strict'

var toArray = require('../_internal/toArray')
var toBinary = require('../binarySet/toBinary')
var data = require('./chords.json')
var index = null

/**
 * Get the chord name(s) of a given pitches
 */
function name (pitches) {
  if (!index) buildIndex()
  var binary = toBinary(pitches)
  var name = index[binary]
  if (!name) return null
  var tonic = toArray(pitches)[0]
  return tonic + name
}

function buildIndex () {
  index = []
  Object.keys(data).forEach(function (name) {
    var binary = toBinary(data[name])
    index[binary] = name
  })
  return index
}

module.exports = name
