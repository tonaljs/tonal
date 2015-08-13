var vows = require('vows')
var assert = require('assert')
var transposeGeneric = require('../../lib/interval/transpose-generic')

vows.describe('Interval').addBatch({
  'generic transposition': function () {
    assert.equal(transposeGeneric(1, 'C'), 'C')
    assert.equal(transposeGeneric(2, 'C'), 'D')
    assert.equal(transposeGeneric(3, 'C'), 'E')
    assert.equal(transposeGeneric(-1, 'C'), 'C')
    assert.equal(transposeGeneric(-2, 'C'), 'B')
    assert.equal(transposeGeneric(-3, 'C'), 'A')
  },
  'not valid': function () {
    assert.throws(function () {
      transposeGeneric(0, 'C')
    })
  }
}).export(module)
