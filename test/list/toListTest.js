var vows = require('vows')
var assert = require('assert')
var toList = require('../../lib/list/toList')

vows.describe('Set').addBatch({
  'notes from notes': function () {
    assert.deepEqual(toList('C D E'), ['C4', 'D4', 'E4'])
  },
  'interval list': function () {
    assert.deepEqual(toList('P-1 M-2 M-3'), ['P-1', 'M-2', 'M-3'])
  }
}).export(module)
