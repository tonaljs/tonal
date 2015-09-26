'use strict'

var pitchSet = require('./pitchSet')
var rotate = require('../collection/rotate')
var chordName = require('../chord/name')

/**
 * Get the triads of
 *
 * @param {String} key - the key name
 * @return {Array} a pitch class set
 *
 * @example
 * triads('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
 * triads('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
 */
function triads (key) {
  var notes = pitchSet(key)
  return notes.map(function (tonic, index) {
    var scale = rotate(notes, index).filter(function (n, i) { return i % 2 === 0 })
    return chordName(scale)
  })
}

module.exports = triads
