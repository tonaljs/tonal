/* global describe it expect */
var n = require('..')

describe('tonal-encoding', () => {
  it('encode pitch classes', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(function (e) { return n.encode(e, 0) }))
    .toEqual([ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ])
    expect([0, 1, 2, 3, 4, 5, 6].map(function (e) { return n.encode(e, 1) }))
    .toEqual([ [ 7 ], [ 9 ], [ 11 ], [ 6 ], [ 8 ], [ 10 ], [ 12 ] ])
    expect([0, 1, 2, 3, 4, 5, 6].map(function (e) { return n.encode(e, -1) }))
    .toEqual([ [ -7 ], [ -5 ], [ -3 ], [ -8 ], [ -6 ], [ -4 ], [ -2 ] ])
  })

  it('encode notes or intervals', () => {
    // C#2 [0, 1, 2]
    expect(n.encode(0, 1, 2)).toEqual([ 7, -2 ])
    // Db
    expect(n.encode(1, -1)).toEqual([-5])
    // Db-1 [1, -1, -1]
    expect(n.encode(1, -1, -1)).toEqual([-5, 2])
    // 8A
    expect(n.encode(0, 1, 1)).toEqual([ 7, -3 ])
    // 9m
    expect(n.encode(1, -1, 1)).toEqual([ -5, 4 ])
  })

  it('decode pitch class', () => {
    function dec (e) { return n.decode.apply(null, e) }
    expect([ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ].map(dec))
    .toEqual([ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 4, 0 ], [ 5, 0 ], [ 6, 0 ] ])
    expect([ [ 7 ], [ 9 ], [ 11 ], [ 6 ], [ 8 ], [ 10 ], [ 12 ] ].map(dec))
    .toEqual([ [ 0, 1 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 4, 1 ], [ 5, 1 ], [ 6, 1 ] ])
    expect([ [ -7 ], [ -5 ], [ -3 ], [ -8 ], [ -6 ], [ -4 ], [ -2 ] ].map(dec))
    .toEqual([ [ 0, -1 ], [ 1, -1 ], [ 2, -1 ], [ 3, -1 ], [ 4, -1 ], [ 5, -1 ], [ 6, -1 ] ])
  })

  it('decode note or intervals', () => {
    expect(n.decode(7, -2)).toEqual([0, 1, 2])
    expect(n.decode(-7, 4)).toEqual([0, -1, 0])
  })
})
