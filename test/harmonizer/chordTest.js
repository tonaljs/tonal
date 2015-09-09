var vows = require('vows')
var assert = require('assert')
var chord = require('../../lib/harmonizer/chord')

vows.describe('harmonizer/chord').addBatch({
  'chord intervals': function () {
    assert.deepEqual(chord('m7b5')('C4'), ['C4', 'Eb4', 'Gb4', 'Bb4'])
  },
  'chord notes': function () {
    assert.deepEqual(chord('maj7')('C#4'), ['C#4', 'E#4', 'G#4', 'B#4'])
  },
  'chord names': function () {
    assert.equal(chord.names().length, 229)
  }
}).export(module)
