var vows = require('vows')
var assert = require('assert')
var toArray = require('../../lib/internal/toArray')

vows.describe('internal/toArray').addBatch({
  'strings': function () {
    assert.deepEqual(toArray('C d'), ['C', 'd'])
    assert.deepEqual(toArray('c 2'), ['c', '2'])
    assert.deepEqual(toArray('c, d, e'), ['c', 'd', 'e'])
    assert.deepEqual(toArray('ii | V | I '), ['ii', 'V', 'I'])
  },
  'elements': function () {
    assert.deepEqual([2, 3], [2, 3])
    assert.deepEqual(toArray(2), [2])
  }
}).export(module)
