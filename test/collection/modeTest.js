var vows = require('vows')
var assert = require('assert')
var mode = require('../../lib/collection/mode')

vows.describe('collection/mode').addBatch({
  'collection modes': function () {
    assert.deepEqual(mode(2, 'C D E F G A B'), ['D', 'E', 'F', 'G', 'A', 'B', 'C'])
  }
}).export(module)
