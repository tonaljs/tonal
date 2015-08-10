var vows = require('vows')
var assert = require('assert')
var name = require('../lib/midi-note-name')

vows.describe('Note').addBatch({
  'from midi': function () {
    assert.equal(name(60), 'C4')
    assert.equal(name(69), 'A4')
    assert.equal(name(70), 'Bb4')
    assert.equal(name(72), 'C5')
    assert.equal(name(72, 'C'), 'C5')
    assert.equal(name(72, 'B'), 'B#4')
  }
}).export(module)
