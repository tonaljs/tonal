var vows = require('vows')
var assert = require('assert')
var set = require('../../lib/set/set')

vows.describe('Set').addBatch({
  'notes from notes': function () {
    assert.deepEqual(set('C D E'), ['C', 'D', 'E'])
  },
  'interval set': function () {
    assert.deepEqual(set('P-1 M-2 M-3'), ['P-1', 'M-2', 'M-3'])
  }
}).export(module)
