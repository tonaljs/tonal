/* global describe it */
var assert = require('assert')
var ic = require('..')

describe('interval-class', function () {
  it('get interval class of simple intervals', function () {
    assert.deepEqual('1 2 3 4 5 6 7 8'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
    assert.deepEqual('1d 2m 3m 4d 5d 6m 7m 8d'.split(' ').map(ic),
      [ 1, 1, 3, 4, 6, 4, 2, 1 ])
  })

  it('get interval class of compound intervals', function () {
    assert.deepEqual('8 9 10 11 12 13 14 15'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  })

  it('get interval class of descending intervals', function () {
    assert.deepEqual('-1 -2 -3 -4 -5 -6 -7 -8'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  })

  it('returns null if not valid interval', function () {
    assert.equal(ic('blah'), null)
  })
})
