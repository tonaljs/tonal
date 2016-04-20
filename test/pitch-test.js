/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe('pitch', function () {
  describe('step', function () {
    var steps = map(tnl.step)
    it('get pitch steps', function () {
      assert.deepEqual(steps('C D E F G A B'), [0, 1, 2, 3, 4, 5, 6])
      assert.deepEqual(steps('C# D# E# F# G# A# B#'), [0, 1, 2, 3, 4, 5, 6])
      assert.deepEqual(steps('C## D## E## F## G## A## B##'), [0, 1, 2, 3, 4, 5, 6])
      assert.deepEqual(steps('Cb Db Eb Fb Gb Ab Bb'), [0, 1, 2, 3, 4, 5, 6])
      assert.deepEqual(steps('Cbb Dbb Ebb Fbb Gbb Abb Bbb'), [0, 1, 2, 3, 4, 5, 6])
    })
  })
  describe('pitch', function () {
    var pitch = tnl.pitch
    it('create pitch classes', function () {
      assert.deepEqual(pitch(0, 0), {ffs: 0})
      assert.deepEqual(pitch(1, 0), {ffs: 2})
      assert.deepEqual(pitch(0, 1), {ffs: 7})
      assert.deepEqual(pitch(0, -1), {ffs: -7})
    })
    it('create pitches', function () {
      assert.deepEqual(pitch(0, 0, 2), {ffs: 0, oct: 2})
      assert.deepEqual(pitch(0, 1, 2), {ffs: 7, oct: -2})
      assert.deepEqual(pitch(6, 1, 2), {ffs: 12, oct: -4})
    })
  })
  describe('letterStep', function () {
    var steps = map(tnl.letterStep)
    it('map letters to steps', function () {
      assert.deepEqual(steps('C D E F G A B'),
        [ 0, 1, 2, 3, 4, 5, 6 ])
      assert.deepEqual(steps('c d e f g a b'),
        [ 0, 1, 2, 3, 4, 5, 6 ])
    })
  })
  describe('alt', function () {
    var alts = map(tnl.alt)
    it('get pitch alteration', function () {
      assert.deepEqual(alts('C1 D2 E3 F4 G5 A6 B7'),
        [ 0, 0, 0, 0, 0, 0, 0 ])
      assert.deepEqual(alts('Cb1 Db2 Eb3 Fb4 Gb5 Ab6 Bb7'),
        [ -1, -1, -1, -1, -1, -1, -1 ])
      assert.deepEqual(alts('C#1 D#2 E#3 F#4 G#5 A#6 B#7'),
        [ 1, 1, 1, 1, 1, 1, 1 ])
    })
  })
  describe('oct', function () {
    var octs = map(tnl.oct)
    it('get pitch alteration', function () {
      assert.deepEqual(octs('C1 D2 E3 F4 G5 A6 B7'),
        [ 1, 2, 3, 4, 5, 6, 7 ])
      assert.deepEqual(octs('Cb1 Db2 Eb3 Fb4 Gb5 Ab6 Bb7'),
        [ 1, 2, 3, 4, 5, 6, 7 ])
      assert.deepEqual(octs('C#1 D#2 E#3 F#4 G#5 A#6 B#7'),
        [ 1, 2, 3, 4, 5, 6, 7 ])
    })
  })
  describe('pitchParse', function () {
    var parse = tnl.pitchParse
    it('parses notes', function () {
      assert.deepEqual(parse('C2'), {ffs:0, oct: 2})
      assert.deepEqual(parse('C#2'), {ffs:7, oct: -2})
      assert.deepEqual(parse('B#2'), {ffs:12, oct: -4})
    })
    it('parse pitch classes', function () {
      assert.deepEqual(map(parse, 'C D E F G A B'),
         [ {ffs:0}, {ffs:2}, {ffs:4}, {ffs:-1}, {ffs:1}, {ffs:3}, {ffs:5} ])
    })
  })
  describe('sci', function () {
    var scis = map((p) => tnl.pitchStr(tnl.pitchParse(p)))
    it('return sci pitches', function () {
      assert.deepEqual(scis('c d e f g a b'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(scis('cb1 db2 eb3 fb4 gb5 ab6 bb7'),
        [ 'Cb1', 'Db2', 'Eb3', 'Fb4', 'Gb5', 'Ab6', 'Bb7' ])
      assert.deepEqual(scis('c#1 d#2 e#3 f#4 g#5 a#6 b#7'),
        [ 'C#1', 'D#2', 'E#3', 'F#4', 'G#5', 'A#6', 'B#7' ])
    })
  })
})
