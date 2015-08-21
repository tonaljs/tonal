var vows = require('vows')
var assert = require('assert')
var notes = require('../../lib/list/notes')

vows.describe('list/notes').addBatch({
  'note list from decimal': function () {
    assert.deepEqual(notes(2773, 'C'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  },
  'note list from binary': function () {
    assert.deepEqual(notes('100000000001', 'C'), ['C4', 'B4'])
  },
  'note list from interval list': function () {
    assert.deepEqual(notes(['P1', 'm3'], 'C'), ['C4', 'Eb4'])
  },
  'note list from note list': function () {
    assert.deepEqual(notes(['C', 'D', 'E', 'F', 'G', 'A', 'B'], 'C'),
      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
    assert.deepEqual(notes(['C', 'D', 'E', 'F', 'G', 'A', 'B'], 'D'),
      ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5'])
  }
}).export(module)
