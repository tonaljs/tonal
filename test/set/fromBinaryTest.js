var vows = require('vows')
var assert = require('assert')
var fromBinary = require('../../lib/set/fromBinary')

vows.describe('set/fromBinary').addBatch({
  'intervals from decimal number': function () {
    assert.deepEqual(fromBinary(2773), ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
  },
  'intervals from binary': function () {
    assert.deepEqual(fromBinary('101'), ['1P', '2M'])
  },
  'invalid source': function () {
    assert.equal(fromBinary(), null)
    assert.equal(fromBinary('1P C2'), null)
  }
}).export(module)
