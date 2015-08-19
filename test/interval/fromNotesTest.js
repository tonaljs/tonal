var vows = require('vows')
var assert = require('assert')
var fromNotes = require('../../lib/interval/fromNotes')

vows.describe('Interval').addBatch({
  'tdd': function () {
    assert.equal(fromNotes('C', 'D'), 'M2')
    assert.equal(fromNotes('C#', 'D'), 'm2')
    assert.equal(fromNotes('C', 'Db'), 'm2')
    assert.equal(fromNotes('D', 'C'), 'M7')
  }
}).export(module)
