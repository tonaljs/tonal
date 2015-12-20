/* global describe it */
var assert = require('assert')
var G = require('..')

describe('music-gamut/select', function () {
  it('select', function () {
    assert.deepEqual(G.select('1 3 5', 'C D E f g a b'), ['C', 'E', 'g'])
  })

  it('curry', function () {
    assert.deepEqual(G.select('1 3 5')('C D E f g a b'), ['C', 'E', 'g'])
  })
})
