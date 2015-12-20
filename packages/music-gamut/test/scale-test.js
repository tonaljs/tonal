/* global describe it */
var assert = require('assert')
var scale = require('../scale')

describe('music-gamut/scale', function () {
  it('null tonic', function () {
    assert.deepEqual(scale('c d e f g a b c2 d2', null), ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    assert.deepEqual(scale('1 2 3', null), ['C0', 'D0', 'E0'])
  })
  it('scale scale from intervals', function () {
    assert.deepEqual(scale('1 2 3 4', 'C'), ['C', 'D', 'E', 'F'])
    assert.deepEqual(scale('8 9 10 11', 'C2'), [ 'C2', 'D2', 'E2', 'F2' ])
  })
  it('scale scale from notes', function () {
    assert.deepEqual(scale('C2 D E4 F G A B', 'D5'), ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6'])
    assert.deepEqual(scale('D E F G A B C', 'C'), [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ])
  })
  it('remove duplicaties', function () {
    assert.deepEqual(scale('1 2 2 3 4 11 11#', 'C'), ['C', 'D', 'E', 'F', 'F#'])
    assert.deepEqual(scale('C D E C4 G5 G7 A5 D9', 'A4'), ['A4', 'B4', 'C#5', 'E5', 'F#5'])
  })
  it('get scale intervals', function () {
    assert.deepEqual(scale('C D E F G A', false), [ '1P', '2M', '3M', '4P', '5P', '6M' ])
  })
  it('partial scale', function () {
    var major = scale('1 3 5')
    assert.deepEqual(major('D'), ['D', 'F#', 'A'])
    var lydian = scale('C D E F# G A B')
    assert.deepEqual(lydian('A'), ['A', 'B', 'C#', 'D#', 'E', 'F#', 'G#'])
    var aeolian = scale('A B C D E F G')
    assert.deepEqual(aeolian('Eb'), [ 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db' ])
  })
  it('invalid params', function () {
    assert.deepEqual(scale(null, 'C'), [])
  })
  it('pitch classes', function () {
    assert.deepEqual(scale('c d e f g a b c', false),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
    assert.deepEqual(scale('d e f g a b c d', false),
      ['1P', '2M', '3m', '4P', '5P', '6M', '7m'])
  })
})
