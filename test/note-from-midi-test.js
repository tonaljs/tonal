var vows = require('vows')
var assert = require('assert')
var fromMidi = require('../lib/note-from-midi')

vows.describe('Note from midi').addBatch({
  'from midi': function () {
    assert.equal(fromMidi(60), 'C4')
    assert.equal(fromMidi(69), 'A4')
    assert.equal(fromMidi(70), 'Bb4')
    assert.equal(fromMidi(72), 'C5')
    assert.equal(fromMidi(72, 'C'), 'C5')
    assert.equal(fromMidi(72, 'B'), 'B#4')
  }
}).export(module)
