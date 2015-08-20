var vows = require('vows')
var assert = require('assert')
var scale = require('../../lib/scale/scale')

vows.describe('Scale').addBatch({
  'scale intervals': function () {
    assert.deepEqual(scale('major'), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'scale notes': function () {
    assert.deepEqual(scale('C minor'), ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4'])
  },
  'scale names': function () {
    assert.equal(scale().length, 108)
  }
}).export(module)
