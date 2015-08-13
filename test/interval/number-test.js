var vows = require('vows')
var assert = require('assert')
var number = require('../../lib/interval/number')

vows.describe('Interval').addBatch({
  'interval number': function () {
    assert.equal(number('P5'), 5)
    assert.equal(number('d-6'), 6)
  }
}).export(module)
