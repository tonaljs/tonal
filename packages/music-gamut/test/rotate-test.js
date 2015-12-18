/* global describe it */
var assert = require('assert')
var rotate = require('../rotate')

describe('music-gamut/rotate', function () {
  it('simple rotation', function () {
    assert.deepEqual(rotate(0, 'C D E'), ['C', 'D', 'E'])
    assert.deepEqual(rotate(1, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(rotate(4, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(rotate(-1, 'C D E'), ['E', 'C', 'D'])
    assert.deepEqual(rotate(-2, 'C D E'), ['D', 'E', 'C'])
    assert.deepEqual(rotate(-5, 'C D E'), ['D', 'E', 'C'])
  })
})
