/* global describe it */
var assert = require('assert')
var select = require('../select')

describe('music-gamut/select', function () {
  it('select', function () {
    assert.deepEqual(select('1 3 5', 'C D E f g a b'), ['C', 'E', 'g'])
  })

  it('curry', function () {
    assert.deepEqual(select('1 3 5')('C D E f g a b'), ['C', 'E', 'g'])
  })
})
