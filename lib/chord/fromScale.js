var genericSet = require('../set/genericSet')
var toBinary = require('../set/toBinary')
var data = require('./chords.js')
var index = null
var keys = null

/**
 * Return all the chord names of a given scale
 *
 */
function fromScale (scale) {
  if (!index) buildIndex()
  scale = toBinary(genericSet(scale))
  return keys.filter(function (chord) {
    return chord & scale === chord
  })
}

function buildIndex () {
  index = {}
  Object.keys(data).forEach(function (name) {
    var binary = toBinary(data[name].split(' '))
    index[binary] = name
  })
  keys = Object.keys(index)
}

module.exports = fromScale
