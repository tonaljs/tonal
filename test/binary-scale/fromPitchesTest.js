var vows = require('vows')
var assert = require('assert')
var fromPitches = require('../../lib/binary-scale/fromPitches')

vows.describe('binary-scale/fromPitches').addBatch({
  'set to binary': function () {
    assert.equal(fromPitches('C D E'), '101010000000')
    assert.equal(fromPitches('C4 D5 E4'), '101010000000')
    assert.equal(fromPitches('C4 C4 C5 C6 C7'), '100000000000')
    assert.equal(fromPitches(['G', 'B', 'D', 'F#']), '100010010001')

  }
}).export(module)
