/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')

describe('collections', function () {
  describe('range', function () {
    it('numeric range: mix to max both included', function () {
      assert.deepEqual(_.range(null, 0, 10),
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
    })
    it('numeric range: max to min both included', function () {
      assert.deepEqual(_.range(null, 10, 0),
        [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ])
    })
    it('note range ascending', function () {
      assert.deepEqual(_.range(null, 'C4', 'C5'),
        [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ])
      assert.deepEqual(_.range(true, 'C4', 'C5'),
        [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
    })
    it('note range descending', function () {
      assert.deepEqual(_.range(false, 'C5', 'C4'),
        [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ])
      assert.deepEqual(_.range(true, 'C5', 'C4'),
        [ 'C5', 'B4', 'Bb4', 'A4', 'Ab4', 'G4', 'Gb4', 'F4', 'E4', 'Eb4', 'D4', 'Db4', 'C4' ])
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
      assert.deepEqual(map(_.sci, 'a bb cx'), [ 'A', 'Bb', 'C##' ])
    })
    it('can be partially applied', function () {
      var notes = map(_.sci)
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
