/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')

describe('tonal pitches', function () {
  describe('asPitch', function () {
    it('returns the same object if array notation', function () {
      var p = _.pcPitch(3)
      assert(_.asPitch(p) === p)
    })
    it('returns parsed pitch if string', function () {
      assert.deepEqual(_.asPitch('C'), [ 'tnl', 0 ])
      assert.deepEqual(_.asPitch('C4'), [ 'tnl', 0, 4 ])
      assert.deepEqual(_.asPitch('5P'), [ 'tnl', 1, 0, 1 ])
    })
    it('returns null for any other object', function () {
      assert(_.asPitch(null) === null)
      assert(_.asPitch('blah') === null)
      assert(_.asPitch([ 0, 2, null ]) === null)
      assert(_.asPitch({ a: 'b' }) === null)
    })
  })
})
