var vows = require('vows')
var assert = require('assert')
var fromIntervals = require('../../lib/binary-scale/fromIntervals')

vows.describe('binary-scale/fromIntervals').addBatch({
  'set to binary': function () {
    assert.equal(fromIntervals('1P 2M 3M'), '101010000000')
    assert.equal(fromIntervals('2M 3M 4P'), '101100000000')
  }
}).export(module)
