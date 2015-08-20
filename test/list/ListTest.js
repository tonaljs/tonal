var vows = require('vows')
var assert = require('assert')
var list = require('../../lib/list/list')

vows.describe('Set').addBatch({
  'notes from notes': function () {
    assert.deepEqual(list('C D E'), ['C', 'D', 'E'])
  },
  'interval list': function () {
    assert.deepEqual(list('P-1 M-2 M-3'), ['P-1', 'M-2', 'M-3'])
  }
}).export(module)
