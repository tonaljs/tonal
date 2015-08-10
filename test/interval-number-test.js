var vows = require('vows')
var assert = require('assert')
var intervalNumber = require('../lib/interval-number')

vows.describe('interval number').addBatch({
  'interval number': function () {
    assert.equal(intervalNumber('C', 'C'), 1)
    assert.equal(intervalNumber('C', 'D'), 2)
    assert.equal(intervalNumber('C', 'B'), 7)
    assert.equal(intervalNumber('C', 'B', true), -2)
    assert.equal(intervalNumber('C', 'G', false), 5)
    assert.equal(intervalNumber('C', 'G', true), -4)
  }
}).export(module)
