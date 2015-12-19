/* global describe it */
var assert = require('assert')
var names = require('..').names

describe('chord.names', function () {
  it('names', function () {
    assert(names().length > 100)
    assert(names(true).length > names().length)
  })
})
