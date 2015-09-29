var vows = require('vows')
var assert = require('assert')
var isBinaryScale = require('../../lib/binary-scale/isBinaryScale')

vows.describe('binary-scale/isBinaryScale').addBatch({
  'valid scales': function () {
    assert.equal(isBinaryScale('101011010101'), true)
  },
  'invalid scales': function () {
    assert.equal(isBinaryScale('101'), false)
  }
}).export(module)
