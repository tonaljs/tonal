/* global describe it */
var assert = require('assert')
var harmonize = require('..')

describe('note-harmonizer', function () {
  it('harmonizes a note with intervals', function () {
    assert.deepEqual(harmonize('1 3 5')('A4'), ['A4', 'C#5', 'E5'])
  })

  it('harmonizes a note with a pitch set', function () {
    assert.deepEqual(harmonize('C E G')('A4'), ['A4', 'C#5', 'E5'])
  })

  it('if tonic is null, returns the gamut', function () {
    assert.deepEqual(harmonize('c2 D4 blah P4', null), [ 'C2', 'D4', null, '4P' ])
  })

  it('if tonic is a note, returns notes', function () {
    assert.deepEqual(harmonize('1 3 5', 'A4'), ['A4', 'C#5', 'E5'])
    assert.deepEqual(harmonize('C2 E2 G2', 'A4'), ['A4', 'C#5', 'E5'])
  })

  it('if tonic is a pitch class, returns pitch classes', function () {
    assert.deepEqual(harmonize('1 3 5', 'A'), [ 'A', 'C#', 'E' ])
    assert.deepEqual(harmonize('1 3 5 7 9', 'A'), [ 'A', 'C#', 'E', 'G#', 'B' ])
  })

  describe('if tonic is false, returns intervals', function () {
    it('simple', function () {
      assert.deepEqual(harmonize('c2 d2 e2 f2 g2', false),
      ['1P', '2M', '3M', '4P', '5P'])
    })
    it('pitch classes are always ascending', function () {
      assert.deepEqual(harmonize('c d e f g a b c', false),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M', '1P'])
      assert.deepEqual(harmonize('d e f g a b c d', false),
      ['1P', '2M', '3m', '4P', '5P', '6M', '7m', '1P'])
      assert.deepEqual(harmonize('f g a b c d e f', false),
      ['1P', '2M', '3M', '4A', '5P', '6M', '7M', '1P'])
    })
    it('chord descending', function () {
      assert.deepEqual(harmonize('c2 b1 a1', false), ['1P', '-2m', '-3m'])
    })
  })
})
