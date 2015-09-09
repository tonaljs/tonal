var vows = require('vows')
var assert = require('assert')
var sequence = require('../../lib/sequence/sequence')

vows.describe('sequence/sequence').addBatch({
  'convert to array of notes': function () {
    assert.deepEqual(sequence('C D'), ['C4', 'D4'])
  }
}).export(module)
