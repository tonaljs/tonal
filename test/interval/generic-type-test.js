var vows = require('vows')
var assert = require('assert')
var genericType = require('../../lib/interval/generic-type')

vows.describe('Interval').addBatch({
  'perfect generic genericType': function () {
    assert.equal(genericType(0), 'perfect')
    assert.equal(genericType(3), 'perfect')
    assert.equal(genericType(4), 'perfect')
    assert.equal(genericType(7), 'perfect')
  },
  'major generic genericType': function () {
    assert.equal(genericType(1), 'major')
    assert.equal(genericType(2), 'major')
  },
  'compound': function () {
    assert.equal(genericType(8), 'major')
    assert.equal(genericType(11), 'perfect')
  }
}).export(module)
