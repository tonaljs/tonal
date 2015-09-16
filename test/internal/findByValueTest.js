var vows = require('vows')
var assert = require('assert')
var findByValue = require('../../lib/internal/findByValue')

vows.describe('internal/findByValue').addBatch({
  'findByValue': function () {
    var data = {a: 1, b: 2}
    var finder = findByValue(data)
    assert.equal(finder(2), 'b')
  }
}).export(module)
