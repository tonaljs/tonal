var vows = require('vows')
var assert = require('assert')
var fromMidi = require('../../lib/pitch/fromMidi')

vows.describe('pitch/fromMidi').addBatch({
  'pitch from midi': function () {
    assert.equal(fromMidi(60), 'C4')
    assert.equal(fromMidi(69), 'A4')
  }
}).export(module)
