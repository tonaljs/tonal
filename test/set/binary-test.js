var vows = require('vows')
var assert = require('assert')
var binary = require('../../lib/set/binary')

vows.describe('Set').addBatch({
  'intervals to binary': function () {
    assert.deepEqual(binary(['P1', 'M2']), '101')
    assert.deepEqual(binary(['P1', 'P8']), '1000000000001')
  }
}).export(module)
