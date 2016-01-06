/* global describe it */
var assert = require('assert')
var parse = require('../accidentals/parse')

describe('music-notation/accidentals/parse', function () {
  it('parses empty accidentals', function () {
    assert.equal(parse(''), 0)
  })

  it('parses shaprs', function () {
    assert.equal(parse('#'), 1)
    assert.equal(parse('##'), 2)
    assert.equal(parse('###'), 3)
    assert.equal(parse('####'), 4)
  })

  it('parses flats', function () {
    assert.equal(parse('b'), -1)
    assert.equal(parse('bb'), -2)
    assert.equal(parse('bbb'), -3)
    assert.equal(parse('bbbb'), -4)
  })

  it('returns null if not valid accidentals', function () {
    assert.equal(parse(), null)
    assert.equal(parse('blah'), null)
  })
})
