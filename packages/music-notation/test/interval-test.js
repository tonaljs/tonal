/* global describe it */
var assert = require('assert')
var interval = require('../interval/interval')

describe('music-notation/interval/interval', function () {
  it('get intervals', function () {
    assert.equal(interval('3'), '3M')
    assert.equal(interval('-3m'), '-3m')
    assert.equal(interval('m-3'), '-3m')
    assert.equal(interval(), null)
  })
})
