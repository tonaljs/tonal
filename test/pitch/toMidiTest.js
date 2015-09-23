var vows = require('vows')
var assert = require('assert')
var toMidi = require('../../lib/pitch/toMidi')

vows.describe('pitch/toMidi').addBatch({
  'pitch toMidi': function () {
    assert.deepEqual('C D E F G A B C'.split(' ').map(toMidi), [60, 62, 64, 65, 67, 69, 71, 60])
  },
  'edge cases': function () {
    assert.equal(toMidi('B#3'), toMidi('C4'))
    assert.equal(toMidi('B##3'), toMidi('Db4'))
  }
}).export(module)
