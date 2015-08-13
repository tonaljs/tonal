var vows = require('vows')
var assert = require('assert')
var fromName = require('../../lib/scale/from-name')
var notes = require('../../lib/scale/notes')

vows.describe('Scale').addBatch({
  'scale notes': function () {
    assert.deepEqual(notes(fromName, 'C', 'major'), ['C4'])
  }
}).export(module)
