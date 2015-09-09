var vows = require('vows')
var assert = require('assert')
var reverse = require('../../lib/sequence/reverse')

vows.describe('sequence/reverse').addBatch({
  'reverse strings': function () {
    assert.deepEqual(reverse('C D E'), ['E4', 'D4', 'C4'])
  },
  'reverse arrays': function () {
    assert.deepEqual(reverse(['A', 'B', 'C']), ['C', 'B', 'A'])
  }
}).export(module)
