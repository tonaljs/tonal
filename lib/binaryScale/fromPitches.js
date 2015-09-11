'use strict'

var pitch = require('../pitch/pitch')
var list = require('../list/list')

/**
 * Return the binary scale number of a list of notes
 */
function toBinary (pitches) {
  pitches = list(pitches, pitch)
  var tonic = pitch(pitches[0])
  var binary = new Uint8Array(12)
  pitches.forEach(function (p) { binary[(pitch(p).midi - tonic.midi) % 12] = 1 })
  return binary.join('')
}

module.exports = toBinary
