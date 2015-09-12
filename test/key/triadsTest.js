var vows = require('vows')
var assert = require('assert')
var triads = require('../../lib/key/triads')

vows.describe('key/triads').addBatch({
  'key note set': function () {
    assert.deepEqual(triads('G major'), [])
  }
}).export(module)
