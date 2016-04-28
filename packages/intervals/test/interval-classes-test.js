/* global describe it */
var assert = require('assert')
var ivl = require('..')

describe('interval-class', function () {
  var ic = ivl.ic
  it('get interval class of simple intervals', function () {
    assert.deepEqual('1P 2M 3M 4P 5P 6M 7M 8P'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
    assert.deepEqual('1d 2m 3m 4d 5d 6m 7m 8d'.split(' ').map(ic),
      [ 1, 1, 3, 4, 6, 4, 2, 1 ])
  })

  it('get interval class of compound intervals', function () {
    assert.deepEqual('8P 9M 10M 11P 12P 13M 14M 15P'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  })

  it('get interval class of descending intervals', function () {
    assert.deepEqual('-1P -2M -3M -4P -5P -6M -7M -8P'.split(' ').map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  })

  it('get interval class from a distance in semitones', function () {
    assert.deepEqual([0, 2, 4, 5, 7, 9, 11, 12].map(ic),
      [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  })

  it('returns null if not valid interval', function () {
    assert.equal(ic('blah'), null)
  })
})
