var vows = require('vows')
var assert = require('assert')
var list = require('../../lib/list/list')

vows.describe('sequence/sequence').addBatch({
  'create a list with parser': function () {
    var parser = function (i) { return /^\d+$/.test(i) ? null : i.toUpperCase() }
    assert.deepEqual(list('C d', parser), ['C', 'D'])
    assert.deepEqual(list('c 2', parser), null)
  },
  'create a list without parser': function () {
    assert.deepEqual(list('A B'), ['A', 'B'])
    assert.deepEqual(list(['A', 'B']), ['A', 'B'])
  }
}).export(module)
