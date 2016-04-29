/* global describe it */
'use strict'

var assert = require('assert')
var note = require('../')
var map = function (fn) { return function (s) { return s.split(' ').map(fn) } }

describe('pitch properties', function () {
  describe('name', function () {
    it('get names from strings', function () {
      assert.deepEqual(map(note.name)('c bb fx'),
        [ 'C', 'Bb', 'F##' ])
    })
  })
  describe('pc', function () {
    var pcs = map(note.pc)
    it('get pitch classes', function () {
      assert.deepEqual(pcs('C4 D4 E4 F4 G4 A4 B4'),
        [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(pcs('C#4 D#4 E#4 F#4 G#4 A#4 B#4'),
        [ 'C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#' ])
      assert.deepEqual(pcs('Cb4 Db4 Eb4 Fb4 Gb4 Ab4 Bb4'),
        [ 'Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb' ])
    })
  })
})
