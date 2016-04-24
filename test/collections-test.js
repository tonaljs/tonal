/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')

describe('collections', function () {
  describe('max', function () {
    it('get max note from a list', function () {
      assert.equal(tonal.max('c3 b2 a5 d#4'), 'A5')
    })
  })
  describe('harmonizer', function () {
    it('creates an harmonizer function', function () {
      var maj7 = tonal.harmonizer('1P 3M 5P 7M')
      assert.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
    })
  })
  describe('harmonize', function () {
    var harmonize = tonal.harmonize
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
    var map = tonal.map
    it('splits list source', function () {
      assert.deepEqual(map(tonal.sci, 'a bb cx'), [ 'A', 'Bb', 'C##' ])
    })
    it('can be partially applied', function () {
      var notes = map(tonal.sci)
      assert.deepEqual(notes('a bb cx'), [ 'A', 'Bb', 'C##' ])
    })
  })
})
