var vows = require('vows')
var assert = require('assert')
var opposite = require('../../lib/interval/opposite')

vows.describe('interval/opposite').addBatch({
  'opposite interval': function () {
    assert.equal(opposite('1P'), '-1P')
    assert.equal(opposite('2M'), '-2M')
    assert.equal(opposite('-2M'), '2M')
    assert.equal(opposite('-9M'), '9M')
    assert.equal(opposite('14M'), '-14M')
    assert.equal(opposite('-14A'), '14A')
  }
}).export(module)
