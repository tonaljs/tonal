var vows = require('vows')
var assert = require('assert')
var isInterval = require('../../lib/interval/isInterval')

vows.describe('Interval').addBatch({
  'isInterval valid': function () {
    assert.equal(isInterval('P1'), true)
    assert.equal(isInterval('M2'), true)
    assert.equal(isInterval('M-2'), true)
    assert.equal(isInterval('M-9'), true)
    assert.equal(isInterval('M14'), true)
    assert.equal(isInterval('A14'), true)
  },
  'isInterval not valid': function () {
    assert.equal(isInterval('blah'), false)
    assert.equal(isInterval('P3'), false)
    assert.equal(isInterval('M5'), false)
  }
}).export(module)
