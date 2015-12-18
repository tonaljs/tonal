/* global describe it */
var assert = require('assert')
var str = require('..').pitch.str

describe('pitch.str', function () {
  it('pitch to string', function () {
    assert.equal(str([0]), 'C')
    assert.equal(str([0, 0]), '1P')
    assert.equal(str([0, 0, 0]), 'C0')
  })
})
