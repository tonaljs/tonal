/* global describe it */
var assert = require('assert')
var ic = require('..')

describe('interval-class', function () {
  it('get ic of intervals', function () {
    assert.deepEqual('1 2 3 4 5 6 7 8'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  })
})
