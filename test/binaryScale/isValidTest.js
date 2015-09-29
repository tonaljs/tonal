var vows = require('vows')
var assert = require('assert')
var isValid = require('../../lib/binaryScale/isValid')

vows.describe('binaryScale/isValid').addBatch({
  'valid scales': function () {
    assert.equal(isValid('101011010101'), true)
  },
  'invalid scales': function () {
    assert.equal(isValid('101'), false)
  }
}).export(module)
