var vows = require('vows')
var assert = require('assert')
var mode = require('../../lib/scale/mode')

vows.describe('scale/mode').addBatch({
  'scale modes': function () {
    assert.deepEqual(mode('C major', 2), ['D', 'E', 'F', 'G', 'A', 'B', 'C'])
  }
}).export(module)
