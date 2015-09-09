var vows = require('vows')
var assert = require('assert')
var scale = require('../../lib/harmonizer/scale')

vows.describe('harmonizer/scale').addBatch({
  'scale notes': function () {
    assert.deepEqual(scale('major', 'D3'), ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4'])
    assert.deepEqual(scale('minor', 'C4'), ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4'])
  },
  'scale names': function () {
    assert.equal(scale.names().length, 108)
  }
}).export(module)
