var vows = require('vows')
var assert = require('assert')
var pitchSet = require('../../lib/sequence/pitchSet')

vows.describe('sequence/pitchSet').addBatch({
  'convert to array of notes': function () {
    assert.deepEqual(pitchSet('C D'), ['C4', 'D4'])
  },
  'sort by pitch': function () {
    assert.deepEqual(pitchSet('C4 D3'), ['D3', 'C4'])
  },
  'remove duplicates': function () {
    assert.deepEqual(pitchSet('C D E C'), ['C4', 'D4', 'E4'])
  },
  'pitch classes only': function () {
    assert.deepEqual(pitchSet('C D E C5 D7 F9', true), ['C', 'D', 'E', 'F'])
  }
}).export(module)
