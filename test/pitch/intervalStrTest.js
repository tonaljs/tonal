var vows = require('vows')
var assert = require('assert')
var intervalStr = require('../../lib/pitch/intervalStr')

vows.describe('pitch/intervalStr').addBatch({
  'intervalStr': function () {
    assert.deepEqual(intervalStr([1, 0, 0]), '1P')
    assert.deepEqual(intervalStr([2, 0, 0]), '2M')
    assert.deepEqual(intervalStr([7, -1, 0]), '7m')
    assert.deepEqual(intervalStr([5, 1, 0]), '5A')
    assert.deepEqual(intervalStr([2, -1, 1]), '9m')
    assert.deepEqual(intervalStr([7, -1, -1]), '-2M')
    assert.deepEqual(intervalStr([7, -1, -2]), '-9M')
    assert.deepEqual(intervalStr([7, -1, -3]), '-16M')
  }
}).export(module)
