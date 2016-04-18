/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe('interval', function () {
  describe('ivlParse', function () {
    it('parses intervals', function () {
      assert.deepEqual(tnl.ivlParse('m-3'), [2, -1, 0, -1])
    })
  })
  describe('ivlParse/ivlStr', function () {
    var ivls = map((i) => tnl.ivlStr(tnl.ivlParse(i)))
    it('converts intervals', function () {
      assert.deepEqual(ivls('P1 M2 M3 P4 P5 M6 M7'),
        [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    })
  })
})
