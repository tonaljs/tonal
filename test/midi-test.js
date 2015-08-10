var vows = require('vows')
var assert = require('assert')
var midi = require('../lib/midi.js')

vows.describe('midi').addBatch({
  'midi': function () {
    assert.equal(midi('C4'), 60)
    assert.equal(midi('C5'), 72)
    assert.equal(midi('C'), 60)
    assert.equal(midi('A4'), 69)
    assert.equal(midi('B#4'), 72)
    assert.equal(midi('Bb4'), 70)
  }
}).export(module)
