/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe('coords', function () {
  describe('coord', function () {
    it('convert from array notation to coord', function () {
      assert.deepEqual(tnl.coord([1,0,4]), [2, 3])
    })
    it('converts from coord to array', function () {
      assert.deepEqual(tnl.coordArr([2, 3]), [1, 0, 4])
    })
  })
})
