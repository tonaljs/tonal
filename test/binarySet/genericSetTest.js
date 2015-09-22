var vows = require('vows')
var assert = require('assert')
var genericSet = require('../../lib/binarySet/genericSet')

vows.describe('binary-set/genericSet').addBatch({
  'intervals from decimal number': function () {
    assert.deepEqual(genericSet(2773), ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
  },
  'intervals from binary': function () {
    assert.deepEqual(genericSet('101'), ['1P', '2M'])
  },
  'invalid source': function () {
    assert.equal(genericSet(), null)
    assert.equal(genericSet('1P C2'), null)
  }
}).export(module)
