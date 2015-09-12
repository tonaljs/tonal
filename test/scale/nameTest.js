var vows = require('vows')
var assert = require('assert')
var name = require('../../lib/scale/name')

vows.describe('scale/name').addBatch({
  'scale name': function () {
    assert.deepEqual(name('C D E F G A B'), 'C major')
    assert.deepEqual(name('D E F G A B C'), 'D dorian')
    assert.deepEqual(name('a b c d e f g'), 'A aeolian')
  }
}).export(module)
