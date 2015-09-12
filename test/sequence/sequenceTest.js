var vows = require('vows')
var assert = require('assert')
var sequence = require('../../lib/sequence/sequence')

vows.describe('sequence/sequence').addBatch({
  'create a sequence with parser': function () {
    var parser = function (i) { return /^\d+$/.test(i) ? null : i.toUpperCase() }
    assert.deepEqual(sequence('C d', parser), ['C', 'D'])
    assert.deepEqual(sequence('c 2', parser), null)
  },
  'create a sequence without parser': function () {
    assert.deepEqual(sequence('A B'), ['A', 'B'])
    assert.deepEqual(sequence(['A', 'B']), ['A', 'B'])
  }
}).export(module)
