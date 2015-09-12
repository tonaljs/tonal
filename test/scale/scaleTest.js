var vows = require('vows')
var assert = require('assert')
var scale = require('../../lib/scale/scale')

vows.describe('scale/scale').addBatch({
  'scale notes': function () {
    assert.deepEqual(scale('D major'), ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'])
    assert.deepEqual(scale('C minor'), ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'])
    assert.deepEqual(scale('F# major'), ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'])
  },
  'invalid scales': function () {
    assert.equal(scale('C blah'), null)
  }
}).export(module)
