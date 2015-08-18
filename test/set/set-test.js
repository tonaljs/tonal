var vows = require('vows')
var assert = require('assert')
var set = require('../../lib/set/set')

vows.describe('Set').addBatch({
  'notes from notes': function () {
    assert.deepEqual(set('C D E'), ['C', 'D', 'E'])
  }
}).export(module)
