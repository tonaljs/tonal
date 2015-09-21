var vows = require('vows')
var assert = require('assert')
var fifthsFrom = require('../../lib/fifths/fifthsFrom')

vows.describe('fifths/fifths').addBatch({
  'map fifhts': function () {
    assert.deepEqual('C D E F G A B'.split(' ').map(fifthsFrom()), [0, 2, 4, -1, 1, 3, 5])
  }
}).export(module)
