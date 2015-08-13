var vows = require('vows')
var assert = require('assert')
var fromName = require('../../lib/scale/from-name')
var notes = require('../../lib/scale/notes')

vows.describe('Scale').addBatch({
  'scale notes': function () {
    assert.deepEqual(notes(fromName, 'C', 'major'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  }
}).export(module)
