var vows = require('vows')
var assert = require('assert')
var key = require('../../lib/pitch/key')

vows.describe('pitch/key').addBatch({
  'pitch key': function () {
    assert.equal(key('A4'), 49)
    assert.deepEqual('C D E F G A B C'.split(' ').map(key), [ 40, 42, 44, 45, 47, 49, 51, 40 ])
  }
}).export(module)
