var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/scale/names')

vows.describe('scale/names').addBatch({
  'scale names': function () {
    assert.deepEqual(names('C D E F G A B'), ['C major', 'C ionian'])
    assert.deepEqual(names('D E F G A B C'), ['D dorian'])
    assert.deepEqual(names('a b c d e f g'), ['A aeolian', 'A minor'])
  }
}).export(module)
