var vows = require('vows')
var assert = require('assert')
var fromIntervals = require('../../lib/binary-scale/fromIntervals')

vows.describe('binary-scale/fromIntervals').addBatch({
  'set to binary': function () {
    assert.equal(fromIntervals('P1 M2 M3'), '101010000000')
    assert.equal(fromIntervals('M2 M3 P4'), '101100000000')
  }
}).export(module)
