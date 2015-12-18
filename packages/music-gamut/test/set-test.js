/* global describe it */
var assert = require('assert')
var set = require('..').set

describe('music-gamut/set', function () {
  it('pitch set', function () {
    assert.deepEqual(set('C2 C4 C C6'), ['C'])
    assert.deepEqual(set('f c g c6 e5'), ['C', 'E', 'F', 'G'])
  })
  it('interval set', function () {
    assert.deepEqual(set('1 2 3 8 9 10 11'), [ '1P', '2M', '3M', '4P' ])
    assert.deepEqual(set('11 10 9'), [ '2M', '3M', '4P' ])
  })
})
