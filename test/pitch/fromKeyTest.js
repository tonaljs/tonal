var vows = require('vows')
var assert = require('assert')
var fromKey = require('../../lib/pitch/fromKey')

vows.describe('pitch/fromKey').addBatch({
  'pitch from midi': function () {
    assert.equal(fromKey(40), 'C4')
    assert.equal(fromKey(49), 'A4')
  }
}).export(module)
