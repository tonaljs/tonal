var vows = require('vows')
var assert = require('assert')
var pitch = require('../../lib/pitch/pitch')

vows.describe('pitch/pitch').addBatch({
  'pitch pitch': function () {
    assert.deepEqual('C ebb bbb F#2 Fx5'.split(' ').map(pitch), ['C4', 'Ebb4', 'Bbb4', 'F#2', 'F##5'])
  }
}).export(module)
