/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe('pitch', function () {
  describe('pitchParse', function () {
    it('parses strings', function () {
      assert.deepEqual(tnl.pitchParse('cx5'), [0, 2, 5])
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
