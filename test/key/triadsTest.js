var vows = require('vows')
var assert = require('assert')
var triads = require('../../lib/key/triads')

vows.describe('key/triads').addBatch({
  'key note set': function () {
    assert.deepEqual(triads('G major'), ['GMaj7', 'Am7', 'Bm7', 'CMaj7', 'D7', 'Em7', 'F#m7b5'])
  }
}).export(module)
