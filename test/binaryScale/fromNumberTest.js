var vows = require('vows')
var assert = require('assert')
var fromNumber = require('../../lib/binaryScale/fromNumber')

vows.describe('binaryScale/fromNumber').addBatch({
  'from integers': function () {
    assert.equal(fromNumber(2048), '100000000000')
    assert.equal(fromNumber(0), '100000000000')
    assert.equal(fromNumber(2773), '101011010101')
  },
  'from binary': function () {
    assert.equal(fromNumber('101011010101'), '101011010101')
  }
}).export(module)
