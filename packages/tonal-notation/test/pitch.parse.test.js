/* global describe it */
var assert = require('assert')
var parse = require('..').pitch.parse

describe('pitch.parse', function () {
  it('notes and intervals', function () {
    assert.deepEqual(parse('D'), [2])
    assert.deepEqual(parse('D2'), [2, 1, null])
    assert.deepEqual(parse('2M'), [2, -1])
  })
  it('invalid values', function () {
    assert.equal(parse(null), null)
    assert.deepEqual(parse([2]), null)
  })
})
