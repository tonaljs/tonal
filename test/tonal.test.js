var vows = require('vows')
var assert = require('assert')
var tonal = require('..')

vows.describe('tonal').addBatch({
  'tonal basic modules': function () {
    assert(tonal)
    assert(tonal.notation)
    assert(tonal.pitch)
    assert(tonal.transpose)
    assert(tonal.distance)
    assert(tonal.note)
  },
  'tonal gamut modules': function () {
    assert(tonal.gamut)
    assert(tonal.set)
    assert(tonal.scale)
    assert(tonal.chord)
  },
  'tonal key modules': function () {
    assert(tonal.key)
  }
}).export(module)
