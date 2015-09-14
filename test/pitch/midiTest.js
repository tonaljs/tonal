var vows = require('vows')
var assert = require('assert')
var midi = require('../../lib/pitch/midi')

vows.describe('pitch/midi').addBatch({
  'pitch midi': function () {
    assert.deepEqual('C D E F G A B C'.split(' ').map(midi), [60, 62, 64, 65, 67, 69, 71, 60])
  }
}).export(module)
