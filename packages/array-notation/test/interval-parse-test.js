/* global describe it */
var assert = require('assert')
var parse = require('../interval/parse')

describe('array-notation/interval/parse', function () {
  it('ascending intervals', function () {
    assert.deepEqual('1 2 3 4 5 6 7'.split(' ').map(parse),
      [ [ 0, 0 ], [ 2, -1 ], [ 4, -2 ], [ -1, 1 ], [ 1, 0 ], [ 3, -1 ], [ 5, -2 ] ])
    assert.deepEqual('1b 2b 3b 4b 5b 6b 7b'.split(' ').map(parse),
      [ [ -7, 4 ], [ -5, 3 ], [ -3, 2 ], [ -8, 5 ], [ -6, 4 ], [ -4, 3 ], [ -2, 2 ] ])
    assert.deepEqual('1# 2# 3# 4# 5# 6# 7#'.split(' ').map(parse),
      [ [ 7, -4 ], [ 9, -5 ], [ 11, -6 ], [ 6, -3 ], [ 8, -4 ], [ 10, -5 ], [ 12, -6 ] ])
  })

  it('descending intervals', function () {
    assert.deepEqual('-1 -2 -3 -4 -5 -6 -7'.split(' ').map(parse),
      [ [ 0, 0 ], [ -2, 1 ], [ -4, 2 ], [ 1, -1 ], [ -1, 0 ], [ -3, 1 ], [ -5, 2 ] ])
    assert.deepEqual('-1b -2b -3b -4b -5b -6b -7b'.split(' ').map(parse),
      [ [ 7, -4 ], [ 5, -3 ], [ 3, -2 ], [ 8, -5 ], [ 6, -4 ], [ 4, -3 ], [ 2, -2 ] ])
  })

  it('compound', function () {
    assert.deepEqual('8 9 10 11 12 13 14'.split(' ').map(parse),
      [ [ 0, 1 ], [ 2, 0 ], [ 4, -1 ], [ -1, 2 ], [ 1, 1 ], [ 3, 0 ], [ 5, -1 ] ])
    assert.deepEqual('15 16 17 18 19 20 21'.split(' ').map(parse),
      [ [ 0, 2 ], [ 2, 1 ], [ 4, 0 ], [ -1, 3 ], [ 1, 2 ], [ 3, 1 ], [ 5, 0 ] ])
  })

  it('edge cases', function () {
    assert.deepEqual(parse('5A'), [8, -4])
    assert.deepEqual(parse('-5A'), [-8, 4])
  })

  it('parses strict shorthand notation', function () {
    assert.deepEqual(parse('M-3'), parse('-3M'))
    assert.deepEqual(parse('A5'), parse('5A'))
  })

  it('invalid intervals', function () {
    assert.equal(parse('5M'), null)
    assert.equal(parse('3P'), null)
  })

  it('invalid values', function () {
    assert.equal(parse(null), null)
    assert.equal(parse('blah'), null)
    assert.equal(parse([0]), null)
  })
})
