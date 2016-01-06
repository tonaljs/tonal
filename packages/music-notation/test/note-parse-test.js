/* global describe it */
var assert = require('assert')
var parse = require('../note/parse')

describe('music-notation/note/parse', function () {
  it('parse pitch class', function () {
    assert.deepEqual('F C G D A E B'.split(' ').map(parse),
      [ [ -1 ], [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ] ])
    assert.deepEqual('F# C# G# D# A# E# B#'.split(' ').map(parse),
      [ [6], [ 7 ], [ 8 ], [ 9 ], [ 10 ], [ 11 ], [ 12 ] ])
    assert.deepEqual('f## c## g## d## a## e## b##'.split(' ').map(parse),
      [ [ 13 ], [ 14 ], [ 15 ], [ 16 ], [ 17 ], [ 18 ], [ 19 ] ])
    assert.deepEqual('Fb Cb Gb Db Ab Eb Bb'.split(' ').map(parse),
      [ [ -8 ], [ -7 ], [ -6 ], [ -5 ], [ -4 ], [ -3 ], [ -2 ] ])
  })
  it('use cached', function () {
    assert.deepEqual(parse('C'), [ 0 ])
  })
  it('parse pitch', function () {
    assert.deepEqual('F4 C4 G4 D4 A4 E4 B4'.split(' ').map(parse),
      [[ -1, 5, null ],
      [ 0, 4, null ],
      [ 1, 4, null ],
      [ 2, 3, null ],
      [ 3, 3, null ],
      [ 4, 2, null ],
      [ 5, 2, null ]])
    assert.deepEqual('F#3 C#3 G#3 D#3 A#3 E#3 B#3'.split(' ').map(parse),
      [ [ 6, 0, null ],
      [ 7, -1, null ],
      [ 8, -1, null ],
      [ 9, -2, null ],
      [ 10, -2, null ],
      [ 11, -3, null ],
      [ 12, -3, null ] ])
    assert.deepEqual('Fb6 Cb6 Gb6 Db6 Ab6 Eb6 Bb6'.split(' ').map(parse),
      [ [ -8, 11, null ],
      [ -7, 10, null ],
      [ -6, 10, null ],
      [ -5, 9, null ],
      [ -4, 9, null ],
      [ -3, 8, null ],
      [ -2, 8, null ] ])
    assert.deepEqual('C0 D0 E0 F0 G0 A0 B0'.split(' ').map(parse),
      [ [ 0, 0, null ],
      [ 2, -1, null ],
      [ 4, -2, null ],
      [ -1, 1, null ],
      [ 1, 0, null ],
      [ 3, -1, null ],
      [ 5, -2, null ] ])
  })
  it('negative octaves', function () {
    assert.deepEqual('f-1 c-1 g-1 d-1 a-1 e-1 b-1'.split(' ').map(parse),
      [ [ -1, 0, null ],
      [ 0, -1, null ],
      [ 1, -1, null ],
      [ 2, -2, null ],
      [ 3, -2, null ],
      [ 4, -3, null ],
      [ 5, -3, null ] ])
  })
  it('parse duration', function () {
    assert.deepEqual('C4/1 D3/2 e2/3 f#3/4'.split(' ').map(parse),
    [ [ 0, 4, 1 ],
      [ 2, 2, 2 ],
      [ 4, 0, 3 ],
      [ 6, 0, 4 ] ])
  })
  it('invalid values', function () {
    assert.equal(parse(null), null)
    assert.equal(parse('blah'), null)
    assert.equal(parse('CMaj7'), null)
    assert.equal(parse('C major'), null)
  })
})
