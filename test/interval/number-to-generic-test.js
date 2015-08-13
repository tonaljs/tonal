var vows = require('vows')
var assert = require('assert')
var generic = require('../../lib/interval/number-to-generic')

vows.describe('Interval').addBatch({
  'number to generic': function () {
    var simples = [1, 2, 3, 4, 5, 6, 7, 8].map(generic)
    assert.deepEqual(simples, [0, 1, 2, 3, 4, 5, 6, 0])
    var descending = [-1, -2, -3, -4, -5, -6, -7, -8].map(generic)
    assert.deepEqual(descending, [0, -1, -2, -3, -4, -5, -6, 0])
  }
}).export(module)
