var vows = require('vows')
var assert = require('assert')
var notes = require('../../lib/scale/notes')
var dictionary = require('../../lib/utils/dictionary')

vows.describe('Scale').addBatch({
  'scale notes': function () {
    assert.deepEqual(notes('C', 2773), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  },
  'with dictionary': function () {
    notes = dictionary({'major': 2773}, notes, 1)
    assert.deepEqual(notes('C', 'major'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  }
}).export(module)
