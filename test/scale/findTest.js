var vows = require('vows')
var assert = require('assert')
var find = require('../../lib/scale/find')

vows.describe('scale/find').addBatch({
  'scale find': function () {
    assert.deepEqual(find('C D E F G A B'), 'C major')
    assert.deepEqual(find('D E F G A B C'), 'D dorian')
    assert.deepEqual(find('a b c d e f g'), 'A aeolian')
  }
}).export(module)
