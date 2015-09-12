var vows = require('vows')
var assert = require('assert')
var reverse = require('../../lib/sequence/reverse')

vows.describe('sequence/reverse').addBatch({
  'reverse strings': function () {
    assert.deepEqual(reverse('C D E'), ['E', 'D', 'C'])
  },
  'reverse arrays': function () {
    assert.deepEqual(reverse(['A', 'B', 'C']), ['C', 'B', 'A'])
  }
}).export(module)
