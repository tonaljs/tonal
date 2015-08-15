var vows = require('vows')
var assert = require('assert')
var chord = require('../../lib/chord/chord')

vows.describe('Chord').addBatch({
  'chord intervals': function () {
    assert.deepEqual(chord('m7b5'), ['P1', 'm3', 'd5', 'm7'])
  },
  'chord notes': function () {
    assert.deepEqual(chord('Cmaj7'), ['C4', 'E4', 'G4', 'B4'])
  }
}).export(module)
