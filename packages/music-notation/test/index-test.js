/* global describe it */
var assert = require('assert')
var notation = require('..')

describe('music-notation', function () {
  it('exists', function () {
    assert(notation)
    assert(notation.accidentals)
    assert(notation.array)
    assert(notation.note)
    assert(notation.interval)
    assert(notation.pitch)
    assert(notation.roman)
  })
})
