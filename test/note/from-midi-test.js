var vows = require('vows')
var assert = require('assert')
var fromMidi = require('../../lib/note/from-midi')

vows.describe('Note').addBatch({
  'note from midi': function () {
    assert.equal(fromMidi(60), 'C4')
    assert.equal(fromMidi(69), 'A4')
  }
}).export(module)
