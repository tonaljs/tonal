var vows = require('vows')
var assert = require('assert')
var modes = require('../../lib/set/modes')

vows.describe('set/modes').addBatch({
  'convert to array of notes': function () {
    assert.deepEqual(modes('C D E'), [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]])
  }
}).export(module)
