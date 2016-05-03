/* global describe it */
'use strict'

var assert = require('assert')
var range = require('../')

describe('collections', function () {
  describe('fromPitchSet', function () {
    it('returns a note name', function () {
      assert.deepEqual(range.fromPitchSet('C D E', 60), 'C4')
    })
    it('can be partially applied', function () {
      var aMajor = range.fromPitchSet('A C# E')
      assert.deepEqual([69, 70, 71, 72, 73].map(aMajor),
        [ 'A4', null, null, null, 'C#5' ])
    })
  })
  describe('cycle of fifths', function () {
    it('ascending', function () {
      assert.deepEqual(range.cycleOfFifths(0, 6, 'C'),
        [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
    })
    it('descending', function () {
      assert.deepEqual(range.cycleOfFifths(0, -6, 'C'),
        [ 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ])
    })
  })
  describe('midi', function () {
    it('ascending range', function () {
      assert.deepEqual(range.midi(0, 10),
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
    })
    it('descending range', function () {
      assert.deepEqual(range.midi(10, 0),
        [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ])
    })
    it('negative numbers', function () {
      assert.deepEqual(range.midi(0, -5), [ 0, -1, -2, -3, -4, -5 ])
      assert.deepEqual(range.midi(-5, -10), [ -5, -6, -7, -8, -9, -10 ])
    })
    it('notes ascending', function () {
      assert.deepEqual(range.midi('C4', 'C5'),
        [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ])
    })
    it('notes descending', function () {
      assert.deepEqual(range.midi('C5', 'C4'),
        [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ])
    })
  })
  describe('chromatic', function () {
    it('ascending ranges', function () {
      assert.deepEqual(range.chromatic('A3', 'A4'),
        [ 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4' ])
    })
    it('descending ranges', function () {
      assert.deepEqual(range.chromatic('A4', 'A3'),
        [ 'A4', 'Ab4', 'G4', 'Gb4', 'F4', 'E4', 'Eb4', 'D4', 'Db4', 'C4', 'B3', 'Bb3', 'A3' ])
    })
  })
  describe('oneOf', function () {
    it('returns a note name from midi', function () {

    })
  })
  describe('scale', function () {
    it('ascending range', function () {
      assert.deepEqual(range.scale('C D E', 'C2', 'C4'),
        [ 'C2', 'D2', 'E2', 'C3', 'D3', 'E3', 'C4' ])
    })
    it('descending range', function () {
      assert.deepEqual(range.scale('C D E F G A B', 'C3', 'C2'),
        [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ])
    })
  })
})
