/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe('pitch properties', function () {
  describe('pc', function () {
    var pcs = map(tnl.pc)
    it('get pitch classes', function () {
      assert.deepEqual(pcs('C4 D4 E4 F4 G4 A4 B4'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(pcs('C#4 D#4 E#4 F#4 G#4 A#4 B#4'),
        [ 'C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#' ])
      assert.deepEqual(pcs('Cb4 Db4 Eb4 Fb4 Gb4 Ab4 Bb4'),
        [ 'Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb' ])
    })
  })
  describe('letter', function () {
    var letters = map(tnl.letter)
    it('get letter from pitch', function () {
      assert.deepEqual(letters('c d e f g a b'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(letters('cb db eb fb gb ab bb'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(letters('c# d# e# f# g# a# b#'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    })
  })
  describe('accidentals', function () {
    var accs = map(tnl.accidentals)
    it('works with pitches', function () {
      assert.deepEqual(accs('cbb cb c# cx'),
        [ 'bb', 'b', '#', '##' ])
    })
  })
  describe('oct', function () {
    var octs = map(tnl.octave)
    it('get pitch octaves', function () {
      assert.deepEqual(octs('c0 c1 c2 c3 c4 c5'),
        [ 0, 1, 2, 3, 4, 5 ])
      assert.deepEqual(octs('c#0 c#1 c#2 c#3 c#4 c#5'),
        [ 0, 1, 2, 3, 4, 5 ])
    })
  })
  describe('isMidi', function () {
    var isMidi = tnl.isMidi
    it.skip('accept valid numbers', function () {
      assert.deepEqual(map(isMidi, [4, 60, 300, -1]),
        [ true, true, false, false ])
    })
    it.skip('arrays are not midi', function () {
      assert.equal(isMidi([4]), false)
    })
  })

  describe('midi', function () {
    var midi = tnl.midi
    it.skip('get midi from notes', function () {
      assert.deepEqual(map(midi, 'C4 D4 E4 F4 G4 A4 B4 C5'),
        [ 60, 62, 64, 65, 67, 69, 71, 72 ])
      assert.deepEqual(map(midi, 'C4 B#3 Dbb4'), [60, 60, 60])
    })
    it.skip('pitch classes do not have midi', function () {
      assert.deepEqual(map(midi, 'C D E F G A B'),
        [ null, null, null, null, null, null, null ])
    })
    it.skip('midi values are bypassed', function () {
      assert.equal(midi(72), 72)
      assert.equal(midi(-1), null)
      assert.equal(midi(129), null)
      assert(midi('60') === 60)
    })
  })
  describe('fromMidi', function () {
    var names = map(tnl.fromMidi)
    it.skip('get pitch names from midi numbers', function () {
      assert.deepEqual(names([60, 61, 62, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
        [ 'C4', 'Db4', 'D4', 'D4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
    })
  })
})
