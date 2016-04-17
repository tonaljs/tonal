/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')
var map = tonal.map
var parse = tonal.sci.parse

var log = (e) => { console.log(e); return e }

describe('pitch module', function () {
  describe('pitchClass', function () {
    var pc = tonal.pitchClass
    it('create pitch classes', function () {
      assert.deepEqual(pc(0, 0), [0])
      assert.deepEqual(pc(1, 0), [2])
      assert.deepEqual(pc(0, 1), [7])
      assert.deepEqual(pc(0, -1), [-7])
    })
  })
  describe('pitch', function () {
    var pitch = tonal.pitch
    it('create pitch classes', function () {
      assert.deepEqual(pitch(0, 0), [0])
      assert.deepEqual(pitch(1, 0), [2])
      assert.deepEqual(pitch(0, 1), [7])
      assert.deepEqual(pitch(0, -1), [-7])
    })
    it('create pitches', function () {
      assert.deepEqual(pitch(0, 0, 2), [0, 2])
      assert.deepEqual(pitch(0, 1, 2), [7, -2])
    })
  })
  describe('sci.parse', function () {
    var parse = tonal.sci.parse
    it('parses notes', function () {
      assert.deepEqual(parse('C2'), [0, 2])
      assert.deepEqual(parse('C#2'), [7, -2])
    })
    it('parse pitch classes', function () {
      assert.deepEqual(map(parse, 'C D E F G A B'),
         [ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ])
    })
  })
  describe('tryPitch', function () {
    var tryPitch = tonal.tryPitch
    it('parses notes', function () {
      assert.deepEqual(tryPitch('c#2'), [7, -2])
    })
    it('skips not strings', function () {
      assert.deepEqual(tryPitch(2), 2)
      assert.deepEqual(tryPitch(['a', 'b']), ['a', 'b'])
    })
  })
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
    var acc = tonal.accidentals
    var accs = map(acc)
    it('it works with numbers', function () {
      assert.equal(acc(2), '##')
      assert.equal(acc(-2), 'bb')
      assert.equal(acc(0), '')
    })
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
    var sci = tonal.sci
    it('convert back to strings', function () {
      assert.deepEqual(sci('C D E F G A B'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(sci('c#1 D##2 Ebb3 Fb4 Gx5 a bbb'),
        [ 'C#1', 'D##2', 'Ebb3', 'Fb4', 'G##5', 'A', 'Bbb' ])
    })
  })
})
