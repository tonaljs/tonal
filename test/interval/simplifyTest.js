var vows = require('vows')
var assert = require('assert')
var simplify = require('../../lib/interval/simplify')

vows.describe('interval/simplify').addBatch({
  'simplify interval': function () {
    assert.equal(simplify('M9'), 'M2')
    assert.equal(simplify('M-9'), 'M-2')
    assert.equal(simplify('M-9', true), 'M2')
    assert.equal(simplify('P8'), 'P8')
  }
}).export(module)
