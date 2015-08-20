var vows = require('vows')
var assert = require('assert')
var isIntervalSet = require('../../lib/list/isIntervalList')

vows.describe('Set').addBatch({
  'valid intervals': function () {
    assert.equal(isIntervalSet('P1 M2'), true)
    assert.equal(isIntervalSet('P-1 M-2'), true)
  }
}).export(module)
