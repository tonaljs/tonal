var vows = require('vows')
var assert = require('assert')
var pitchSet = require('../../lib/sequence/pitchSet')

vows.describe('sequence/pitchSet').addBatch({
  'convert to array of notes': function () {
    assert.deepEqual(pitchSet('C D'), ['C4', 'D4'])
  },
  'sort by pitch': function () {
    assert.deepEqual(pitchSet('C4 D3'), ['D3', 'C4'])
  }
}).export(module)
