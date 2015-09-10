var vows = require('vows')
var assert = require('assert')
var scale = require('../../lib/scale/scale')

vows.describe('scale/scale').addBatch({
  'scale notes': function () {
    assert.deepEqual(scale('D3 major'), ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4'])
    assert.deepEqual(scale('C4 minor'), ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4'])
  }
}).export(module)
