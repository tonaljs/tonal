var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/binaryScale/intervals')

vows.describe('binaryScale/intervals').addBatch({
  'intervals from decimal number': function () {
    assert.deepEqual(intervals('101011010101'), ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
  },
  'intervals from binary': function () {
    assert.deepEqual(intervals('101000000000'), ['1P', '2M'])
  },
  'invalid source': function () {
    assert.equal(intervals(), null)
    assert.equal(intervals('1P C2'), null)
  }
}).export(module)
