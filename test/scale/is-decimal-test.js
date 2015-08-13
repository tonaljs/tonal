var vows = require('vows')
var assert = require('assert')
var isDecimal = require('../../lib/scale/is-decimal')

vows.describe('midi').addBatch({
  'valid': function () {
    assert(isDecimal(2048))
    assert(isDecimal(4095))
    assert(isDecimal(3000))
  },
  'invalid': function () {
    assert(!isDecimal(2047))
    assert(!isDecimal(4096))
    assert(!isDecimal(-7))
  }
}).export(module)
