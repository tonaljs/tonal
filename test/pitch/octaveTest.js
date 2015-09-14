var vows = require('vows')
var assert = require('assert')
var octave = require('../../lib/pitch/octave')

vows.describe('pitch/octave').addBatch({
  'pitch octave': function () {
    assert.deepEqual('C1 D2 E3 F4 G5 A B-1 C0'.split(' ').map(octave), [1, 2, 3, 4, 5, 4, null, 0])
  }
}).export(module)
