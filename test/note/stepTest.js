var vows = require('vows')
var assert = require('assert')
var step = require('../../lib/note/step')

vows.describe('Note').addBatch({
  'note step': function () {
    assert.deepEqual([-4, -3, -2, -1, 0, 1, 2, 3, 4].map(function (amount) {
      return step('C', amount)
    }), ['F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])
    assert.deepEqual([-9, -8, -7, 7, 8, 9].map(function (amount) {
      return step('C', amount)
    }), ['A', 'B', 'C', 'C', 'D', 'E'])
  }
}).export(module)
