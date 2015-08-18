var vows = require('vows')
var assert = require('assert')
var simple = require('../../lib/interval/simpleNumber')

vows.describe('Interval').addBatch({
  'simple interval': function () {
    assert.equal(simple(1), 1)
    assert.equal(simple(9), 2)
    assert.equal(simple(8), 8)
    assert.equal(simple(2), 2)
  }
}).export(module)
