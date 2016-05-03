/* global describe it */
var assert = require('assert')
var density = require('..').density

describe('density', function () {
  it('returns a pmnsdt array from pitch classes', function () {
    assert.deepEqual(density('C E G'), [1, 1, 1, 0, 0, 0])
    assert.deepEqual(density('C Eb G'), [1, 1, 1, 0, 0, 0])
  })

  it('returns a pmnsdt array from notes', function () {
    assert.deepEqual(density('C2 Db5 B3 F#4'), [ 2, 0, 0, 1, 2, 1 ])
  })

  it('intervals are ignored', function () {
    assert.deepEqual(density('P1 5P'), [ 0, 0, 0, 0, 0, 0 ])
  })

  it('resolves example 2-15 of Harmonic Materials', function () {
    assert.deepEqual(density('C D# E G Ab B'), [ 3, 6, 3, 0, 3, 0 ])
  })
})
