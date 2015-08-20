var vows = require('vows')
var assert = require('assert')
var toBinary = require('../../lib/list/toBinary')

vows.describe('list/toBinary').addBatch({
  'intervals to binary': function () {
    assert.deepEqual(toBinary(['P1', 'M2']), '101')
    assert.deepEqual(toBinary(['P1', 'P8']), '1000000000001')
  }
}).export(module)
