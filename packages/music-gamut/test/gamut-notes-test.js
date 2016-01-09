/* global describe it */
var assert = require('assert')
var gamut = require('..')

describe('gamut.notes', function () {
  it('get notes in array notation from a string', function () {
    assert.deepEqual(gamut.notes('C D E F G'), [ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ] ])
    assert.deepEqual(gamut.notes('C2 D2 E2 F2 G2'),
    [ [ 0, 2, null ], [ 2, 1, null ], [ 4, 0, null ], [ -1, 3, null ], [ 1, 2, null ] ])
  })

  it('get notes string from array notation', function () {
    assert.deepEqual(gamut.notes([ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ] ]),
      [ 'C', 'D', 'E', 'F', 'G' ])
    assert.deepEqual(gamut.notes([ [ 0, 2, null ], [ 2, 1, null ], [ 4, 0, null ], [ -1, 3, null ], [ 1, 2, null ] ]),
      [ 'C2', 'D2', 'E2', 'F2', 'G2' ])
  })

  it('doesnt work with intervals', function () {
    assert.deepEqual(gamut.notes('1 2 3 4'), [ null, null, null, null ])
    assert.deepEqual(gamut.notes([[0, 0], [1, 0]]), [ null, null ])
  })
})
