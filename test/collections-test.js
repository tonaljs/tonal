/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')

describe('collections', function () {
  describe('harmonizer', function () {
    it('creates an harmonizer function', function () {
      var maj7 = tonal.harmonizer('1P 3M 5P 7M')
      assert.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
    })
  })
  describe('harmonize', function () {
    var harmonize = tonal.harmonize
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
    var sharp = function (p) { return [p[0] + 7] }
    it('splits strings', function () {
      assert.deepEqual(map(sharp, 'a b c'), [ 'A#', 'B#', 'C#' ])
    })
    it('can be partially applied', function () {
      var sharps = map(sharp)
      assert.deepEqual(sharps('a b c'), [ 'A#', 'B#', 'C#' ])
    })
  })
})
