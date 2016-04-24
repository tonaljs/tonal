/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')

var log = (e) => { console.log(e); return e }

describe('collections', function () {
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
    it('filter nulls', function () {
      assert.deepEqual(harmonize('C blah D'), '7m')
    })
  })
  describe('map', function () {
    var map = tonal.map
    var upper = (s) => s.toUpperCase()
    it('splits strings', function () {
      assert.deepEqual(map(upper, 'a b c'), [ 'A', 'B', 'C' ])
    })
    it('can be partially applied', function () {
      var uppers = map(upper)
      assert.deepEqual(uppers('a b c'), [ 'A', 'B', 'C' ])
    })
  })
})
