var vows = require('vows')
var assert = require('assert')
var genericType = require('../../lib/interval/generic-type')

vows.describe('Interval').addBatch({
  'perfect generic genericType': function () {
    assert.equal(genericType(1), 'perfect')
    assert.equal(genericType(4), 'perfect')
    assert.equal(genericType(5), 'perfect')
    assert.equal(genericType(8), 'perfect')
  },
  'major generic genericType': function () {
    assert.equal(genericType(2), 'major')
    assert.equal(genericType(3), 'major')
  },
  'compound': function () {
    assert.equal(genericType(9), 'major')
    assert.equal(genericType(12), 'perfect')
  }
}).export(module)
