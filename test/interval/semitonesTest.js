var vows = require('vows')
var assert = require('assert')
var semitones = require('../../lib/interval/semitones')

vows.describe('interval/semitones').addBatch({
  'interval semitones': function () {
    assert.deepEqual('1P 2M 3M 4P 5P 6M 7M'.split(' ').map(semitones), [0, 2, 4, 5, 7, 9, 11])
  }
}).export(module)
