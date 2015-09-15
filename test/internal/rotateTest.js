var vows = require('vows')
var assert = require('assert')
var rotate = require('../../lib/internal/rotate')

vows.describe('internal/rotate').addBatch({
  'rotate strings': function () {
    assert.deepEqual(rotate('C D E'.split(' '), 1), ['D', 'E', 'C'])
    assert.deepEqual(rotate('C D E'.split(' '), 2), ['E', 'C', 'D'])
  },
  'rotate arrays': function () {
    assert.deepEqual(rotate(['A', 'B', 'C'], 1), ['B', 'C', 'A'])
  }
}).export(module)
