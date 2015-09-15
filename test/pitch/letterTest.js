var vows = require('vows')
var assert = require('assert')
var letter = require('../../lib/pitch/letter')

vows.describe('pitch/letter').addBatch({
  'pitch letter': function () {
    assert.equal(letter('C#4'), 'C')
    var letters = [0, 1, 2, 3, 4, 5, 6, 7].map(function (num) {
      return letter('C', num)
    })
    assert.deepEqual(letters, ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'])
  }
}).export(module)
