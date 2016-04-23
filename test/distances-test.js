/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe.skip('distances', function () {
  var tr = tnl.transpose
  describe('transpose', function () {
    it('order of params is not relevant', function () {
      assert.equal(tr('c#2', 'm3'), tr('m3', 'c#2'))
    })
    it('transpose notes by intervals', function () {
      assert.deepEqual(map(tr('3M'), 'c2 d3 f4 g5'),
        [ 'E2', 'F#3', 'A4', 'B5' ])
    })
    it('transpose notes by descending intervals', function () {
      assert.deepEqual(map(tr('-2M'), 'c2 d3 f4 g5'),
        [ 'Bb1', 'C3', 'Eb4', 'F5' ])
    })
    it('transposes intervals by intervals', function () {
      assert.deepEqual(map(tr('3M'), '1P 2M 3M 4P 5P'),
        [ '3M', '4A', '5A', '6M', '7M' ])
    })
    it('transposes descending intervals', function () {
      assert.deepEqual(map(tr('-2M'), '1P 2M 3M 4P 5P'),
        [ '0m', '1P', '2M', '3m', '4P' ])
    })
    it('all desending intervals', function () {
      assert.deepEqual(map(tr('-2M'), '-5P -4P -3M -2M 1P'),
        ['-6M', '-5P', '-4A', '-3M', '-2M'])
    })
  })
})
