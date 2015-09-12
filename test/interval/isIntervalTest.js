var vows = require('vows')
var assert = require('assert')
var isInterval = require('../../lib/interval/isInterval')

vows.describe('Interval').addBatch({
  'isInterval valid': function () {
    assert.equal(isInterval('1P'), true)
    assert.equal(isInterval('2M'), true)
    assert.equal(isInterval('-2M'), true)
    assert.equal(isInterval('-9M'), true)
    assert.equal(isInterval('14M'), true)
    assert.equal(isInterval('14A'), true)
  },
  'isInterval not valid': function () {
    assert.equal(isInterval('blah'), false)
    assert.equal(isInterval('3P'), false)
    assert.equal(isInterval('5M'), false)
  }
}).export(module)
