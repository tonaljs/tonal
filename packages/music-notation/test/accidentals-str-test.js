/* global describe it */
var assert = require('assert')
var str = require('../accidentals/str')

describe('music-notation/accidentals/str', function () {
  it('creates accidentals string', function () {
    assert.equal(str(0), '')
    assert.equal(str(1), '#')
    assert.equal(str(2), '##')
    assert.equal(str(-1), 'b')
    assert.equal(str(-2), 'bb')
  })
})
