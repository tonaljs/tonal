var vows = require('vows')
var assert = require('assert')
var toNotes = require('../../lib/list/toNotes')

vows.describe('list/noteList').addBatch({
  'note list from decimal': function () {
    assert.deepEqual(toNotes(2773, 'C'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  },
  'note list from binary': function () {
    assert.deepEqual(toNotes('11', 'C'), ['C4', 'Db4'])
    assert.deepEqual(toNotes('101', 'C'), ['C4', 'D4'])
    assert.deepEqual(toNotes('100000000001', 'C'), ['C4', 'B4'])
    assert.deepEqual(toNotes('1000000000001', 'C'), ['C4', 'C5'])
  },
  'note list from interval list': function () {
    assert.deepEqual(toNotes(['P1', 'm3'], 'C'), ['C4', 'Eb4'])
  },
  'note list from note list': function () {
    assert.deepEqual(toNotes(['C', 'D', 'E', 'F', 'G', 'A', 'B'], 'C'),
      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
    assert.deepEqual(toNotes(['C', 'D', 'E', 'F', 'G', 'A', 'B'], 'D'),
      ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5'])
  }
}).export(module)
