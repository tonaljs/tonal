var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/interval/distance-interval')

vows.describe('Interval').addBatch({
  'distance': function () {
    assert.equal(distance('C', 'G'), 'P5')
    assert.equal(distance('C#', 'G'), 'd5')
  }
}).export(module)
