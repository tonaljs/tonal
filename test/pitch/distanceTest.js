var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/pitch/distance')

vows.describe('pitch/distance').addBatch({
  'distance': function () {
    assert.equal(distance('C4', 'C5'), 12)
    assert.equal(distance('C5', 'C4'), -12)
    assert.equal(distance('c4', 'a3'), -3)
  }
}).export(module)
