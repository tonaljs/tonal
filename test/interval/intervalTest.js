var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/interval')

vows.describe('interval/interval').addBatch({
  'interval interval': function () {
    assert.deepEqual('5P 5A 5M'.split(' ').map(interval), ['5P', '5A', null])
    assert.deepEqual('2A 2AA 2AAA'.split(' ').map(interval), ['5P', '5A', null])
  }
}).export(module)
