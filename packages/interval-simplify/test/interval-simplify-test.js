/* global describe it */
var assert = require('assert')
var simplify = require('..')

describe('interval-simplify', function () {
  it('ascending simple intervals can not be simplified', function () {
    assert.deepEqual('1 2 3 4 5 6 7 8'.split(' ').map(simplify),
      [ '1P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ])
    assert.deepEqual('1b 2b 3b 4b 5b 6b 7b 8b'.split(' ').map(simplify),
      [ '1d', '2m', '3m', '4d', '5d', '6m', '7m', '8d' ])
  })
  it('simplifies octaves', function () {
    assert.deepEqual('1dd 1d 1 1A 1AA'.split(' ').map(simplify),
      [ '1dd', '1d', '1P', '1A', '1AA' ])
    assert.deepEqual('8dd 8d 8 8A 8AA'.split(' ').map(simplify),
      [ '8dd', '8d', '8P', '8A', '8AA' ])
    assert.deepEqual('15dd 15d 15 15A 15AA'.split(' ').map(simplify),
      [ '8dd', '8d', '8P', '8A', '8AA' ])
    assert.deepEqual('22dd 22d 22 22A 22AA'.split(' ').map(simplify),
      [ '8dd', '8d', '8P', '8A', '8AA' ])
    assert.deepEqual('29dd 29d 29 29A 29AA'.split(' ').map(simplify),
      [ '8dd', '8d', '8P', '8A', '8AA' ])
    assert.deepEqual('-1 -8 -15 -22 -29'.split(' ').map(simplify),
      [ '1P', '8P', '8P', '8P', '8P' ])
  })
  it.skip('should invert edge cases', function () {
    assert.deepEqual('-8dd -8d -8 -8A -8AA'.split(' ').map(simplify),
      [ '8AA', '8A', '8P', '8A', '8AA' ])
  })
  it('descending intervals are simplified to ascending', function () {
    assert.deepEqual('-1 -2 -3 -4 -5 -6 -7 -8'.split(' ').map(simplify),
      ['1P', '7m', '6m', '5P', '4P', '3m', '2m', '8P'])
  })
  it('simplifies compound intervals', function () {
    assert.equal(simplify(15))
    assert.deepEqual('8 9 10 11 12 13 14 15'.split(' ').map(simplify),
      [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ])
    assert.deepEqual('15 16 17 18 19 20 21 22'.split(' ').map(simplify),
      [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ])
  })
  it('can not simplify notes', function () {
    assert.equal(simplify('C3'), null)
    assert.equal(simplify('A'), null)
  })
})
