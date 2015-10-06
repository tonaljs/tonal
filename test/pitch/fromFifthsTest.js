var vows = require('vows')
var assert = require('assert')
var fromFifths = require('../../lib/pitch/fromFifths')

vows.describe('pitch/fromFifths').addBatch({
  'fromFifths pitch': function () {
    assert.deepEqual(fromFifths([0, 0]), [1, 0, 0])
    assert.deepEqual(fromFifths([7, 0]), [1, 1, 4])
    assert.deepEqual(fromFifths([1, 0]), [5, 0, 0])
    assert.deepEqual(fromFifths([2, 0]), [2, 0, 1])
    assert.deepEqual(fromFifths([2, -1]), [2, 0, 0])
    assert.deepEqual(fromFifths([0, 1]), [1, 0, 1])
    assert.deepEqual(fromFifths([7, -4]), [1, 1, 0])
    assert.deepEqual(fromFifths([14, -8]), [1, 2, 0])
    assert.deepEqual(fromFifths([14, -7]), [1, 2, 1])
    assert.deepEqual(fromFifths([-1, 0]), [4, 0, -1])
    assert.deepEqual(fromFifths([-2, 1]), [7, -1, -1])
    assert.deepEqual(fromFifths([-3, 0]), [3, -1, -2])
    assert.deepEqual(fromFifths([-7, 0]), [1, -1, -4])
    assert.deepEqual(fromFifths([-8, 0]), [4, -1, -5])
    assert.deepEqual(fromFifths([-9, 0]), [7, -2, -6])
  }
}).export(module)
