var vows = require('vows')
var assert = require('assert')
var isBinary = require('../../lib/set/is-binary-set')

vows.describe('Set').addBatch({
  'valid binary numbers': function () {
    assert(isBinary('100000000000'))
    assert(isBinary('100000001000'))
    assert(isBinary('111111111111'))
  },
  'invalid binary numbers': function () {
    assert(!isBinary('010000000000'))
    assert(!isBinary('120000000000'))
  },
  'valid decimal numbers': function () {
    assert(isBinary(29))
  },
  'invalid decimal numbers': function () {
    assert(!isBinary(-7))
  }
}).export(module)
