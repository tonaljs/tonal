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
  })
  describe('map', function () {
    var map = tonal.map
    it('combines function', function () {
      var a = (a) => a + 'a'
      var b = (b) => b + 'b'
      assert.deepEqual(map([b, a], 'X Y Z'),
        [ 'Xab', 'Yab', 'Zab' ])
    })
  })
})
