var vows = require('vows')
var assert = require('assert')
var cycle = require('../../lib/sequence/cycle')

vows.describe('sequence/cycle').addBatch({
  'cycle': function () {
    assert.deepEqual(cycle('C', '5P', 5), ['C4', 'G4', 'D5', 'A5', 'E6'])
  },
  'with offset': function () {
    assert.deepEqual(cycle('C', '5P', 5, 2), ['D5', 'A5', 'E6', 'B6', 'F#7'])
  }
}).export(module)
