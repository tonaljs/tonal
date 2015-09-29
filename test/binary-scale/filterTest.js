var vows = require('vows')
var assert = require('assert')
var filter = require('../../lib/binary-scale/filter')

vows.describe('binary-scale/filter').addBatch({
  'binary sets': function () {
    assert.deepEqual(filter().length, 2048)
    assert.deepEqual(filter()[0], '100000000000')
    assert.deepEqual(filter()[2047], '111111111111')
    assert.deepEqual(filter(function (b) { return b[11] === '1' }).length, 1024)
  }
}).export(module)
