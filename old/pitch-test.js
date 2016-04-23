/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

var log = (e) => { console.log(e); return e }

describe('pitches', function () {
  describe('pitch', function () {
    var pitch = tnl.pitch
    it('create pitch classes', function () {
      assert.deepEqual(pitch(0, 0), [0])
      assert.deepEqual(pitch(1, 0), [2])
      assert.deepEqual(pitch(0, 1), [7])
      assert.deepEqual(pitch(0, -1), [-7])
    })
    it('create pitches', function () {
      assert.deepEqual(pitch(0, 0, 2), [0, 2])
      assert.deepEqual(pitch(0, 1, 2), [7, -2])
      assert.deepEqual(pitch(6, 1, 2), [12, -4])
    })
  })
  describe('pitchParse', function () {
    var parse = tnl.pitchParse
    it('parses notes', function () {
      assert.deepEqual(parse('C2'), [0, 2])
      assert.deepEqual(parse('C#2'), [7, -2])
      assert.deepEqual(parse('B#2'), [12, -4])
    })
    it('parse pitch classes', function () {
      assert.deepEqual(map(parse, 'C D E F G A B'),
         [ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ])
    })
  })
  describe('tryPitch', function () {
    var tryPitch = tnl.tryPitch
    it('parses notes', function () {
      assert.deepEqual(tryPitch('c#2'), [7, -2])
    })
    it('skips not strings', function () {
      assert.deepEqual(tryPitch(2), 2)
      assert.deepEqual(tryPitch(['a', 'b']), ['a', 'b'])
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
    var octs = map(tnl.oct)
    it('get pitch octaves', function () {
      assert.deepEqual(octs('c0 c1 c2 c3 c4 c5'),
        [ 0, 1, 2, 3, 4, 5 ])
      assert.deepEqual(octs('c#0 c#1 c#2 c#3 c#4 c#5'),
        [ 0, 1, 2, 3, 4, 5 ])
    })
  })
  describe('sci', function () {
    var sci = map((p) => tnl.pitchStr(tnl.pitchParse(p)))
    it('convert back to strings', function () {
      assert.deepEqual(sci('C D E F G A B'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(sci('c#1 D##2 Ebb3 Fb4 Gx5 a bbb'),
        [ 'C#1', 'D##2', 'Ebb3', 'Fb4', 'G##5', 'A', 'Bbb' ])
    })
  })

  describe('isMidi', function () {
    var isMidi = tnl.isMidi
    it('accept valid numbers', function () {
      assert.deepEqual(map(isMidi, [4, 60, 300, -1]),
        [ true, true, false, false ])
    })
    it('arrays are not midi', function () {
      assert.equal(isMidi([4]), false)
    })
  })

  describe('midi', function () {
    var midi = tnl.midi
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
      assert.equal(midi(60), 60)
      assert.equal(midi(-1), null)
      assert.equal(midi(129), null)
      assert(midi('60') === 60)
    })
  })
  describe('fromMidi', function () {
    var names = map(tnl.fromMidi)
    it('get pitch names from midi numbers', function () {
      assert.deepEqual(names([60, 61, 62, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
        [ 'C4', 'Db4', 'D4', 'D4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
    })
  })
})
