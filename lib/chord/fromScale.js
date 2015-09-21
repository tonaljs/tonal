var genericSet = require('../set/genericSet')
var toBinary = require('../set/toBinary')
var data = require('./chords.js')
var index = null
var keys = null

/**
 * Get the chord names that _fits_ a given scale
 *
 * @example
 * fromScale('C D E F G A B') // => ['CM', 'CMaj7']
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
