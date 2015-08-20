var vows = require('vows')
var assert = require('assert')
var fromNotes = require('../../lib/interval/fromNotes')

vows.describe('interval/fromNotes').addBatch({
  'distances to a tonic': function () {
    var notes = 'C D E F G A B C5'.split(' ')
    assert.deepEqual(notes.map(fromNotes('C4')),
      ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7', 'P8'])
    assert.deepEqual(notes.map(fromNotes('C3')),
      ['P8', 'M9', 'M10', 'P11', 'P12', 'M13', 'M14', 'P15'])
  },
  'distance from two notes': function () {
    assert.equal(fromNotes('C', 'D'), 'M2')
    assert.equal(fromNotes('C#', 'D'), 'm2')
    assert.equal(fromNotes('C', 'Db'), 'm2')
    assert.equal(fromNotes('D', 'C'), 'M7')
    assert.equal(fromNotes('C4', 'C5'), 'P8')
    assert.equal(fromNotes('C4', 'D5'), 'M9')
  }
}).export(module)
