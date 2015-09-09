var vows = require('vows')
var assert = require('assert')
var set = require('../../lib/sequence/pitchset')

vows.describe('sequence/pitchset').addBatch({
  'convert to array of notes': function () {
    assert.deepEqual(set('C D'), ['C4', 'D4'])
  },
  'sort by pitch': function () {
    assert.deepEqual(set('C4 D3'), ['D3', 'C4'])
  }
}).export(module)
