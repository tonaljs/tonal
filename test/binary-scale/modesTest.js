var vows = require('vows')
var assert = require('assert')
var modes = require('../../lib/binary-scale/modes')

vows.describe('binary-scale/modes').addBatch({
  'get scale modes': function () {
    assert.deepEqual(modes('101011010101'), [
      '101010110101',
      '101011010101',
      '101011010110',
      '101101010110',
      '101101011010',
      '110101011010',
      '110101101010'
    ])
  },
  'the cannonical mode is always the first': function () {
    var cannonical = modes('110101011010')[0]
    modes('110101011010').forEach(function (scale) {
      assert.equal(modes(scale)[0], cannonical)
    })
  }
}).export(module)
