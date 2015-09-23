var vows = require('vows')
var assert = require('assert')
var toKey = require('../../lib/pitch/toKey')

vows.describe('pitch/toKey').addBatch({
  'pitch toKey': function () {
    assert.equal(toKey('A4'), 49)
    assert.deepEqual('C D E F G A B C'.split(' ').map(toKey), [ 40, 42, 44, 45, 47, 49, 51, 40 ])
  }
}).export(module)
