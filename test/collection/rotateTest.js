var vows = require('vows')
var assert = require('assert')
var rotate = require('../../lib/collection/rotate')

vows.describe('collection/rotate').addBatch({
  'rotate strings': function () {
    assert.deepEqual(rotate(1, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(rotate(2, 'C D E'), ['E', 'C', 'D'])
    assert.deepEqual(rotate(3, 'C D E'), ['C', 'D', 'E'])
  },
  'rotate arrays': function () {
    assert.deepEqual(rotate(1, ['A', 'B', 'C']), ['B', 'C', 'A'])
  }
}).export(module)
