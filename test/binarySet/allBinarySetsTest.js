var vows = require('vows')
var assert = require('assert')
var allBinarySets = require('../../lib/binarySet/allBinarySets')

vows.describe('binary-set/allBinarySets').addBatch({
  'binary sets': function () {
    assert.deepEqual(allBinarySets().length, 2048)
    assert.deepEqual(allBinarySets()[0], '100000000000')
    assert.deepEqual(allBinarySets()[2047], '111111111111')
    assert.deepEqual(allBinarySets(function (b) { return b[11] === '1' }).length, 1024)
  }
}).export(module)
