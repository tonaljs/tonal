var vows = require('vows')
var assert = require('assert')
var pitchClass = require('../../lib/pitch/pitchClass')

vows.describe('pitch/pitchClass').addBatch({
  'pitch pitchClass': function () {
    assert.deepEqual('c bbb c## ex'.split(' ').map(pitchClass), ['C', 'Bbb', 'C##', 'E##'])
  }
}).export(module)
