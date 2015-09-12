var vows = require('vows')
var assert = require('assert')
var add = require('../../lib/interval/add')

vows.describe('interval/add').addBatch({
  'add ascending intervals': function () {
    assert.equal(add('2M', '2M'), '3M')
    assert.equal(add('2M', '2m'), '3m')
    assert.equal(add('2M', '8P'), '9M')
    assert.equal(add('4P', '4P'), '7m')
  },
  'add ascending descending intervals': function () {
    assert.equal(add('2M', '-2M'), '1P')
    assert.equal(add('5P', '-2M'), '4P')
    assert.equal(add('-2M', '5P'), '4P')
    assert.equal(add('4P', '-5P'), '-2M')
    assert.equal(add('1P', '-2m'), '-2m')
    assert.equal(add('1P', '-9m'), '-9m')
    assert.equal(add('-9m', '8P'), '-2m')
    assert.equal(add('8P', '-9m'), '-2m')
    assert.equal(add('8P', '-2M'), '7m')
  },
  'add descending intervals': function () {
    assert.equal(add('-2M', '-2M'), '-3M')
  }
}).export(module)
