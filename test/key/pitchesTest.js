var vows = require('vows')
var assert = require('assert')
var pitches = require('../../lib/key/pitches')

vows.describe('key/pitches').addBatch({
  'key note set': function () {
    assert.deepEqual(pitches('g major'), ['G', 'A', 'B', 'C', 'D', 'E', 'F#'])
    assert.deepEqual(pitches('bbb'), ['Bbb', 'Cb', 'Db', 'Ebb', 'Fb', 'Gb', 'Ab'])
    assert.deepEqual(pitches('Eb minor'), ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'])
  }
}).export(module)
