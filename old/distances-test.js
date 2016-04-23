/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')
var map = tonal.map

var log = (e) => { console.log(e); return e }

describe('distances', function () {
  var tr = tonal.tr
  describe('transpose', function () {
    it('order of params is not relevant', function () {
      assert.equal(tr('c#2', 'm3'), tr('m3', 'c#2'))
    })
    it('transpose notes by intervals', function () {
      assert.deepEqual(map(tr('3M'), 'c2 d3 f4 g5'),
      [ 'E2', 'F#3', 'A4', 'B5' ])
    })
  })
})
