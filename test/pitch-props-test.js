/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')
var map = tonal.map

describe('pitch properties', function () {
  describe('letter', function () {
    var letters = map(tonal.letter)
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
    var accs = map(tonal.accidentals)
    it('works with pitches', function () {
      assert.deepEqual(accs('cbb cb c# cx'),
        [ 'bb', 'b', '#', '##' ])
    })
  })
  describe('oct', function () {
    var octs = map(tonal.oct)
    it('get pitch octaves', function () {
      assert.deepEqual(octs('c0 c1 c2 c3 c4 c5'),
        [ 0, 1, 2, 3, 4, 5 ])
      assert.deepEqual(octs('c#0 c#1 c#2 c#3 c#4 c#5'),
        [ 0, 1, 2, 3, 4, 5 ])
    })
  })
  describe('sci', function () {
    var sci = map((p) => tonal.pitchStr(tonal.pitchParse(p)))
    it('convert back to strings', function () {
      assert.deepEqual(sci('C D E F G A B'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(sci('c#1 D##2 Ebb3 Fb4 Gx5 a bbb'),
        [ 'C#1', 'D##2', 'Ebb3', 'Fb4', 'G##5', 'A', 'Bbb' ])
    })
  })

  describe('isMidi', function () {
    var isMidi = tonal.isMidi
    it('accept valid numbers', function () {
      assert.deepEqual(map(isMidi, [4, 60, 300, -1]),
        [ true, true, false, false ])
    })
    it('arrays are not midi', function () {
      assert.equal(isMidi([4]), false)
    })
  })

  describe('midi', function () {
    var midi = tonal.midi
    it('get midi from notes', function () {
      assert.deepEqual(map(midi, 'C4 D4 E4 F4 G4 A4 B4 C5'),
        [ 60, 62, 64, 65, 67, 69, 71, 72 ])
      assert.deepEqual(map(midi, 'C4 B#3 Dbb4'), [60, 60, 60])
    })
    it('pitch classes do not have midi', function () {
      assert.deepEqual(map(midi, 'C D E F G A B'),
        [ null, null, null, null, null, null, null ])
    })
    it('midi values are bypassed', function () {
      assert.equal(midi(72), 72)
      assert.equal(midi(-1), null)
      assert.equal(midi(129), null)
      assert(midi('60') === 60)
    })
  })
  describe('fromMidi', function () {
    var names = map(tonal.fromMidi)
    it('get pitch names from midi numbers', function () {
      assert.deepEqual(names([60, 61, 62, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
        [ 'C4', 'Db4', 'D4', 'D4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
    })
  })
})
