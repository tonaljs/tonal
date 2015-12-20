/* global describe it */
var assert = require('assert')
var notation = require('..')

describe('array-notation', function () {
  it('exists', function () {
    assert(notation)
    assert(notation.note)
    assert(notation.interval)
    assert(notation.pitch)
  })
})
