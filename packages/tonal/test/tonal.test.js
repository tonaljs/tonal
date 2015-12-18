/* global describe it */
var assert = require('assert')
var tonal = require('..')

describe('tonal', function () {
  it('tonal basic modules', function () {
    assert(tonal)
    assert(tonal.notation)
    assert(tonal.pitch)
    assert(tonal.transpose)
    assert(tonal.distance)
    assert(tonal.note)
  })

  it('tonal gamut modules', function () {
    assert(tonal.gamut)
    assert(tonal.set)
    assert(tonal.scale)
    assert(tonal.chord)
  })

  it('tonal key modules', function () {
    assert(tonal.key)
  })
})
