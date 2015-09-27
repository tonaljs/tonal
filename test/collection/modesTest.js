var vows = require('vows')
var assert = require('assert')
var modes = require('../../lib/collection/modes')

vows.describe('set/modes').addBatch({
  'convert to array of notes': function () {
    assert.deepEqual(modes('C D E'), [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]])
  },
  'collection to set': function () {
    assert.deepEqual(modes('C4 C5 D6 E7 E8'), modes('C D E'))
  }
}).export(module)
