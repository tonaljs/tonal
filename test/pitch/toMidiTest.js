var vows = require('vows')
var assert = require('assert')
var toMidi = require('../../lib/pitch/toMidi')

vows.describe('pitch/toMidi').addBatch({
  'pitch toMidi': function () {
    assert.deepEqual('C D E F G A B C'.split(' ').map(toMidi), [60, 62, 64, 65, 67, 69, 71, 60])
  }
}).export(module)
