/* global describe it */
var assert = require('assert')
var parse = require('..').parse

describe('music-gamut/parse', function () {
  it('parse strings', function () {
    assert.deepEqual(parse('blah C P1 C2'), [ null, [ 0 ], [ 0, 0 ], [ 0, 2, null ] ])
  })
  it('bypases array notation', function () {
    assert.deepEqual(parse([ null, [ 0 ], [ 0, 0 ], [ 0, 2, null ] ]),
      [ null, [ 0 ], [ 0, 0 ], [ 0, 2, null ] ])
  })
})
