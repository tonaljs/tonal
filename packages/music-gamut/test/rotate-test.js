/* global describe it */
var assert = require('assert')
var G = require('..')

describe('music-gamut/rotate', function () {
  it('simple rotation', function () {
    assert.deepEqual(G.rotate(0, 'C D E'), ['C', 'D', 'E'])
    assert.deepEqual(G.rotate(1, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(G.rotate(4, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(G.rotate(-1, 'C D E'), ['E', 'C', 'D'])
    assert.deepEqual(G.rotate(-2, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(G.rotate(-5, 'C D E'), ['D', 'E', 'C'])
  })
})
