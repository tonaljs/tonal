var vows = require('vows')
var assert = require('assert')
var distanceFrom = require('../../lib/fifths/distanceFrom')

vows.describe('fifths/distanceFrom').addBatch({
  'map fifhts': function () {
    assert.deepEqual('C D E F G A B'.split(' ').map(distanceFrom()), [0, 2, 4, -1, 1, 3, 5])
    assert.deepEqual('C D E F G A B'.split(' ').map(distanceFrom('C')), [0, 2, 4, -1, 1, 3, 5])
    assert.deepEqual('C D E F G A B'.split(' ').map(distanceFrom('F')), [1, 3, 5, 0, 2, 4, 6])
  }
}).export(module)
