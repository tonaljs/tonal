var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/interval/distance-generic')

vows.describe('Interval').addBatch({
  'distance': function () {
    assert.equal(distance('C', 'G'), 4)
    assert.equal(distance('G', 'C'), -4)
    assert.equal(distance('C', 'C'), 0)
    assert.equal(distance('C', 'A'), 5)
  }
}).export(module)
