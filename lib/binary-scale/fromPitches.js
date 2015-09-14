'use strict'

var midi = require('../pitch/midi')
var toArray = require('../utils/toArray')

/**
 * Return the binary scale number of a sequence of pitches
 *
 * @param {String|Array} pitches - a sequence of pitches
 * @return {String} a binary number representing the given pitch set
 */
function toBinary (pitches) {
  var midis = toArray(pitches).map(midi)
  var tonic = midis[0]
  var binary = new Uint8Array(12)
  midis.forEach(function (p) { binary[(p - tonic + 12) % 12] = 1 })
  return binary.join('')
}

module.exports = toBinary
