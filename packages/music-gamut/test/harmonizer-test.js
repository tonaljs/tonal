/* global describe it */
var assert = require('assert')
var harmonizer = require('..').harmonizer

describe('music-gamut/hamornizer', function () {
  it('get an harmonizer', function () {
    assert.deepEqual(harmonizer('1 3 5')('A4'), ['A4', 'C#5', 'E5'])
  })

  describe('hamornizes', function () {
    it('harmonizes from intervals', function () {
      assert.deepEqual(harmonizer('1 3 5', 'A4'), ['A4', 'C#5', 'E5'])
    })
    it('harmonizes from notes', function () {
      assert.deepEqual(harmonizer('C2 E2 G2', 'A4'), ['A4', 'C#5', 'E5'])
    })
  })

  describe('harmonics', function () {
    it('simple', function () {
      assert.deepEqual(harmonizer('c2 d2 e2 f2 g2', false),
      ['1P', '2M', '3M', '4P', '5P'])
    })
    it('pitch classes are always ascending', function () {
      assert.deepEqual(harmonizer('c d e f g a b c', false),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M', '1P'])
      assert.deepEqual(harmonizer('d e f g a b c d', false),
      ['1P', '2M', '3m', '4P', '5P', '6M', '7m', '1P'])
      assert.deepEqual(harmonizer('f g a b c d e f', false),
      ['1P', '2M', '3M', '4A', '5P', '6M', '7M', '1P'])
    })
    it('harmonizer descending', function () {
      assert.deepEqual(harmonizer('c2 b1 a1', false), ['1P', '-2m', '-3m'])
    })
  })
})
