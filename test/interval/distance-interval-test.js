var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/interval/distance-interval')

vows.describe('Interval').addBatch({
  'basic distances': function () {
    assert.equal(distance('C', 'G'), 'P5')
    assert.equal(distance('C', 'A'), 'M6')
  }
}).export(module)
