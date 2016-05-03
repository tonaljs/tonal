/* global describe it */
'use strict'

var assert = require('assert')
var midi = require('..')
var map = function (fn, s) {
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

describe('tonal-midi', function () {
  describe('isMidi', function () {
    it('accept valid numbers', function () {
      assert.deepEqual(map(midi.isMidi, [-1, 0, 127, 128]),
        [ false, true, true, false ])
    })
    it('arrays are not midi', function () {
      assert.equal(midi.isMidi([4]), false)
      assert.equal(midi.isMidi(null), false)
      assert.equal(midi.isMidi(), false)
    })
  })
  describe('toMidi', function () {
    it('get midi from notes', function () {
      assert.deepEqual(map(midi.toMidi, 'C4 D4 E4 F4 G4 A4 B4 C5'),
        [ 60, 62, 64, 65, 67, 69, 71, 72 ])
      assert.deepEqual(map(midi.toMidi, 'C4 B#3 Dbb4'), [60, 60, 60])
    })
    it('pitch classes do not have midi', function () {
      assert.deepEqual(map(midi.toMidi, 'C D E F G A B'),
        [ null, null, null, null, null, null, null ])
    })
    it('midi values are bypassed', function () {
      assert.equal(midi.toMidi(72), 72)
      assert(midi.toMidi('60') === 60)
    })
    it('invalid midi values returns null', function () {
      assert.equal(midi.toMidi(null), null)
      assert.equal(midi.toMidi(-1), null)
      assert.equal(midi.toMidi(128), null)
    })
  })
  describe('fromMidi', function () {
    it('get pitch names from midi numbers', function () {
      assert.deepEqual(map(midi.fromMidi, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
        [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
    })
  })
  describe('fromMidiSharps', function () {
    it('get pitch names from midi numbers with shaprs altered notes', function () {
      assert.deepEqual(map(midi.fromMidiSharps, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
        [ 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ])
    })
  })
})
