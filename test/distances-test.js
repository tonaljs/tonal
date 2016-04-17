/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')
var map = tonal.map
var parse = tonal.sci.parse

var log = (e) => { console.log(e); return e }

describe('distances module', function () {
  describe('transpose', function () {
    it('transpose notes by intervals', function () {
      assert.deepEqual(map(tonal.tr('3M'), 'c2 d3 f4 g5'),
      [ 'E2', 'F#3', 'A4', 'B5' ])
    })
  })
})
