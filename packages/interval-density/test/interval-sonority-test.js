/* global describe it */
var assert = require('assert')
var density = require('..')

describe('interval-density', function () {
  it('returns a pmnsdt array', function () {
    assert.deepEqual(density('C E G'), [1, 1, 1, 0, 0, 0])
    assert.deepEqual(density('C Eb G'), [1, 1, 1, 0, 0, 0])
  })

  it('resolves example 2-15 of Harmonic Materials', function () {
    assert.deepEqual(density('C D# E G Ab B'), [ 3, 6, 3, 0, 3, 0 ])
  })
})
