/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')

describe('collections', function () {
  describe('cycle of fifths', function () {
    it('ascending', function () {
      assert.deepEqual(_.range(0, 6).map(_.fifthsFrom('C')),
        [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
    })
    it('descending', function () {
      assert.deepEqual(_.range(0, -6).map(_.fifthsFrom('C')),
        [ 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ])
    })
  })
  describe('range', function () {
    it('ascending range', function () {
      assert.deepEqual(_.range(0, 10),
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
    })
    it('descending range', function () {
      assert.deepEqual(_.range(10, 0),
        [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ])
    })
    it('negative numbers', function () {
      assert.deepEqual(_.range(0, -5), [ 0, -1, -2, -3, -4, -5 ])
      assert.deepEqual(_.range(-5, -10), [ -5, -6, -7, -8, -9, -10 ])
    })
    it('notes ascending', function () {
      assert.deepEqual(_.range('C4', 'C5'),
        [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ])
    })
    it('notes descending', function () {
      assert.deepEqual(_.range('C5', 'C4'),
        [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ])
    })
  })
  describe('chromatic', function () {
    it('ascending ranges', function () {
      assert.deepEqual(_.chromatic('A3', 'A4'),
        [ 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4' ])
    })
    it('descending ranges', function () {
      assert.deepEqual(_.chromatic('A4', 'A3'),
        [ 'A4', 'Ab4', 'G4', 'Gb4', 'F4', 'E4', 'Eb4', 'D4', 'Db4', 'C4', 'B3', 'Bb3', 'A3' ])
    })
  })
  describe('harmonizer', function () {
    it('creates an harmonizer function', function () {
      var maj7 = _.harmonizer('1P 3M 5P 7M')
      assert.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
    })
  })
  describe('harmonize', function () {
    var harmonize = _.harmonize
    it('filter nulls', function () {
      assert.deepEqual(harmonize('C blah D', '7m'), [ 'Bb', 'C' ])
      assert.deepEqual(harmonize('C D E', null), [])
      assert.deepEqual(harmonize(null, null), [])
    })
    it('harmonizes intervals by tonic', function () {
      assert.deepEqual(harmonize('1P 3M 5P', 'A4'),
        [ 'A4', 'C#5', 'E5' ])
    })
    it('harmonizes notes by interval', function () {
      assert.deepEqual(harmonize('C E G', 'M3'),
        [ 'E', 'G#', 'B' ])
    })
  })
  describe('map', function () {
    var map = _.map
    it('splits list source', function () {
      assert.deepEqual(map(_.note, 'a bb cx'), [ 'A', 'Bb', 'C##' ])
    })
    it('can be partially applied', function () {
      var notes = map(_.note)
      assert.deepEqual(notes('a bb cx'), [ 'A', 'Bb', 'C##' ])
    })
  })
  describe('filter', function () {
    it ('filter lists', function () {
      assert.deepEqual(_.filter(_.isIntervalStr, 'C d f4 A4 M3'),
        ['A4', 'M3'])
    })
  })
})
