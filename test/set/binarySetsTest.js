var vows = require('vows')
var assert = require('assert')
var binarySets = require('../../lib/set/binarySets')

vows.describe('set/binarySets').addBatch({
  'binary sets': function () {
    assert.deepEqual(binarySets().length, 2048)
    assert.deepEqual(binarySets()[0], '100000000000')
    assert.deepEqual(binarySets()[2047], '111111111111')
    assert.deepEqual(binarySets(function (b) { return b[11] === '1' }).length, 1024)
  }
}).export(module)
