var vows = require('vows')
var assert = require('assert')
var areIntervals = require('../../lib/list/areIntervals')

vows.describe('list/areIntervals').addBatch({
  'valid interval list': function () {
    assert.equal(areIntervals('P1 M2'), true)
    assert.equal(areIntervals('P-1 M-2'), true)
  },
  'invalid interval list': function () {
    assert.equal(areIntervals('M2'), false)
    assert.equal(areIntervals(''), false)
    assert.equal(areIntervals([]), false)
  }
}).export(module)
