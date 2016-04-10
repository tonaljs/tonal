/* global describe it */
var assert = require('assert')
var set = require('..')

describe('pitch-set', function () {
  it('convert notes to pitch classes', function () {
    assert.deepEqual(set('C2 C4 C C6'), ['C'])
    assert.deepEqual(set('f c g c6 e5'), ['F', 'G', 'C', 'E'])
  })
  it('simplify intervals', function () {
    assert.deepEqual(set('1 2 3 8 9 10 11'), [ '1P', '2M', '3M', '4P' ])
    assert.deepEqual(set('11 10 9'), [ '2M', '3M', '4P' ])
  })
  it('first note is first pitch class', function () {
    assert.deepEqual(set('c d e f g a b c2 d2'), ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    assert.deepEqual(set('d4 f5 g2 c6 a1'), [ 'D', 'F', 'G', 'A', 'C' ])
  })
  it('intervals are ordered by size', function () {
    assert.deepEqual(set('1 2 3'), ['1P', '2M', '3M'])
    assert.deepEqual(set('3 2 1'), ['1P', '2M', '3M'])
    assert.deepEqual(set('5 9 11 25'), [ '2M', '4P', '5P' ])
  })
  it('remove duplicaties', function () {
    assert.deepEqual(set('1 2 2 3 4 11 11#'), [ '1P', '2M', '3M', '4P', '4A' ])
    assert.deepEqual(set('C D E C4 G5 G7 A5 D9'), [ 'C', 'D', 'E', 'G', 'A' ])
  })
  it('empty set if null', function () {
    assert.deepEqual(set(null), [])
  })
})
