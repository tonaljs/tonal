var vows = require('vows')
var assert = require('assert')
var distance = require('../lib/distance')

vows.describe('distance').addBatch({
  'distance': function () {
    assert.equal(distance('a2', 'c#3'), 'M3')
    assert.equal(distance('a3', 'a2'), 'P-8')
  }
}).export(module)
