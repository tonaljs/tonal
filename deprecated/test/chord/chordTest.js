var vows = require('vows')
var assert = require('assert')
var chord = require('../../lib/chord/chord')

vows.describe('Chord').addBatch({
  'chord intervals': function () {
    assert.deepEqual(chord('m7b5'), ['P1', 'm3', 'd5', 'm7'])
  },
  'chord notes': function () {
    assert.deepEqual(chord('C#maj7'), ['C#4', 'E#4', 'G#4', 'B#4'])
  }
}).export(module)
