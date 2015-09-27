var vows = require('vows')
var assert = require('assert')
var byFreq = require('../../lib/pitch/byFreq')

vows.describe('pitch/byFreq').addBatch({
  'sort': function () {
    assert.deepEqual('E G A3 C E B C5 E7'.split(' ').sort(byFreq()),
      ['A3', 'C', 'E', 'E', 'G', 'B', 'C5', 'E7'])
    assert.deepEqual('E G A3 C E B C5 E7'.split(' ').sort(byFreq(true)),
      ['A3', 'C', 'E', 'E', 'G', 'B', 'C5', 'E7'].reverse())
  }
}).export(module)
