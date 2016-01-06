/* global describe it */
var assert = require('assert')
var chord = require('..')

describe('music-chord', function () {
  it('creates an chord', function () {
    assert.deepEqual(chord('1 3 5')('A4'), ['A4', 'C#5', 'E5'])
  })

  describe('return notes if tonic', function () {
    it('from intervals and tonic', function () {
      assert.deepEqual(chord('1 3 5', 'A4'), ['A4', 'C#5', 'E5'])
    })
    it('from notes and tonic', function () {
      assert.deepEqual(chord('C2 E2 G2', 'A4'), ['A4', 'C#5', 'E5'])
    })
  })

  describe('returns intervals if tonic is false', function () {
    it('simple', function () {
      assert.deepEqual(chord('c2 d2 e2 f2 g2', false),
      ['1P', '2M', '3M', '4P', '5P'])
    })
    it('pitch classes are always ascending', function () {
      assert.deepEqual(chord('c d e f g a b c', false),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M', '1P'])
      assert.deepEqual(chord('d e f g a b c d', false),
      ['1P', '2M', '3m', '4P', '5P', '6M', '7m', '1P'])
      assert.deepEqual(chord('f g a b c d e f', false),
      ['1P', '2M', '3M', '4A', '5P', '6M', '7M', '1P'])
    })
    it('chord descending', function () {
      assert.deepEqual(chord('c2 b1 a1', false), ['1P', '-2m', '-3m'])
    })
  })
})
