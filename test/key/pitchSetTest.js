var vows = require('vows')
var assert = require('assert')
var pitchSet = require('../../lib/key/pitchSet')

vows.describe('key/pitchSet').addBatch({
  'key note set': function () {
    assert.deepEqual(pitchSet('g major'), ['G', 'A', 'B', 'C', 'D', 'E', 'F#'])
    assert.deepEqual(pitchSet('bbb'), ['Bbb', 'Cb', 'Db', 'Ebb', 'Fb', 'Gb', 'Ab'])
    assert.deepEqual(pitchSet('Eb minor'), ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'])
  }
}).export(module)
