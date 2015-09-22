var vows = require('vows')
var assert = require('assert')
var toIntervals = require('../../lib/binarySet/toIntervals')

vows.describe('binary-set/toIntervals').addBatch({
  'intervals from decimal number': function () {
    assert.deepEqual(toIntervals(2773), ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
  },
  'intervals from binary': function () {
    assert.deepEqual(toIntervals('101'), ['1P', '2M'])
  },
  'invalid source': function () {
    assert.equal(toIntervals(), null)
    assert.equal(toIntervals('1P C2'), null)
  }
}).export(module)
