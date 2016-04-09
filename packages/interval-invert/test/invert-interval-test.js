/* global describe it */
var assert = require('assert')
var invert = require('..')

describe('interval-invert', function () {
  it('inverts a simple interval', function () {
    assert.equal(invert('2M'), '7m')
    assert.equal(invert('7m'), '2M')
    assert.equal(invert('3dd'), '6AA')
  })
  // TODO: some edge cases (relating to octaves)
  it.skip('double inversion leads the same interval', function () {
    function inv2 (i) { return invert(invert(i)) }
    assert.deepEqual('1 2 3 4 5 6 7 8'.split(' ').map(inv2),
      [ '1P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ])
    assert.deepEqual('1b 2b 3b 4b 5b 6b 7b 8b'.split(' ').map(inv2),
      [ '1d', '2m', '3m', '4d', '5d', '6m', '7m', '8d' ])
    assert.deepEqual('1# 2# 3# 4# 5# 6# 7# 8#'.split(' ').map(inv2),
      [ '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A' ])
  })
  // the inversion of any compound interval is always the
  // same as the inversion of the simple interval from
  // which it is compounded
  it('inversion of compound is same as simple', function () {
    assert.equal(invert('9M'), invert('2M'))
  })
})
