var vows = require('vows')
var assert = require('assert')
var isInterval = require('../../lib/interval/is-interval')

vows.describe('Interval').addBatch({
  'interval number': function () {
    assert.equal(isInterval('P1'), true)
    assert.equal(isInterval('M2'), true)
    assert.equal(isInterval('M-2'), true)
    assert.equal(isInterval('M-9'), true)
    assert.equal(isInterval('M14'), true)
    assert.equal(isInterval('A14'), true)
  }
}).export(module)
