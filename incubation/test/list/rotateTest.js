var vows = require('vows')
var assert = require('assert')
var rotate = require('../../lib/list/rotate')

vows.describe('list/rotate').addBatch({
  'rotate notes': function () {
    assert.deepEqual(rotate('C D E F G A B C'),
      [])
  }
}).export(module)
