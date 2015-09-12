'use strict'

var pitch = require('../pitch/pitch')
var sequence = require('../sequence/sequence')

/**
 * Return the binary scale number of a sequence of notes
 */
function toBinary (pitches) {
  pitches = sequence(pitches, pitch)
  var tonic = pitches[0]
  var binary = new Uint8Array(12)
  pitches.forEach(function (p) { binary[(p.midi - tonic.midi) % 12] = 1 })
  return binary.join('')
}

module.exports = toBinary
