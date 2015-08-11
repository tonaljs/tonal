var vows = require('vows')
var assert = require('assert')
var isBinary = require('../lib/is-scale-binary-number.js')

vows.describe('midi').addBatch({
  'valid': function () {
    assert(isBinary('100000000000'))
    assert(isBinary('100000001000'))
    assert(isBinary('111111111111'))
  },
  'invalid': function () {
    assert(!isBinary('010000000000'))
    assert(!isBinary('120000000000'))
    assert(!isBinary('10000000000'))
  }
}).export(module)
