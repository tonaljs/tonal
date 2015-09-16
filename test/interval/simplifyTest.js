var vows = require('vows')
var assert = require('assert')
var simplify = require('../../lib/interval/simplify')

vows.describe('interval/simplify').addBatch({
  'simplify interval': function () {
    assert.equal(simplify('9M'), '2M')
    assert.equal(simplify('-9M'), '-2M')
    assert.equal(simplify('-2M', true), '2M')
    assert.equal(simplify('-9M', true), '2M')
    assert.equal(simplify('8P'), '8P')
  }
}).export(module)
