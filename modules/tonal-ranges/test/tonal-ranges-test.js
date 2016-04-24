var assert = require('assert')
var ranges = require('..')
var range = ranges.range
var take = ranges.take

describe('tonal-ranges', function () {
  describe('take', function () {
    it('takes a positive number', function () {
      assert.deepEqual(take(null, 60, 5), [ 60, 61, 62, 63, 64 ])
      assert.deepEqual(take(true, 10, 5), [ 'A#-1', 'B-1', 'C0', 'C#0', 'D0' ])
      assert.deepEqual(take('C D E F G', 60, 5), [ 'C4', 'D4', 'E4', 'F4', 'G4' ])
    })
    it('takes a negative number', function () {
      assert.deepEqual(take(null, 60, -5), [ 60, 59, 58, 57, 56 ])
      assert.deepEqual(take(false, 60, -5), [ 'C4', 'B3', 'Bb3', 'A3', 'Ab3' ])
      assert.deepEqual(take('C D E F G', 60, -5), [ 'C4', 'G3', 'F3', 'E3', 'D3' ])
    })
    it('accepts a note', function () {
      assert.deepEqual(take(false, 'C2', 3), [ 'C2', 'Db2', 'D2' ])
      assert.deepEqual(take(false, 'C2', -3), [ 'C2', 'B1', 'Bb1' ])
    })
    it('can be partially applied', function () {
      assert.deepEqual(take(null)('C2', 3), [ 36, 37, 38 ])
      assert.deepEqual(take(null, 'C2')(3), [ 36, 37, 38 ])
    })
  })
  describe('range', function () {
    it('pitch set note range', function () {
      assert.deepEqual(range('C D', 'C2', 'C4'),
        [ 'C2', 'D2', 'C3', 'D3', 'C4' ])
      assert.deepEqual(range('C D', 'C4', 'C2'),
        [ 'C4', 'D3', 'C3', 'D2', 'C2' ])
    })
    it('pitch set midi range', function () {
      assert.deepEqual(range('C D', 60, 80),
        [ 'C4', 'D4', 'C5', 'D5' ])
      assert.deepEqual(range('Bb Cb', 60, 72),
        [ 'Bb4', 'Cb4' ])
    })
    it('chromatic midi ranges', function () {
      assert.deepEqual(range(false, 60, 50),
        [ 'C4', 'B3', 'Bb3', 'A3', 'Ab3', 'G3', 'Gb3', 'F3', 'E3', 'Eb3', 'D3' ])
      assert.deepEqual(range(true, 0, 7),
        [ 'C-1', 'C#-1', 'D-1', 'D#-1', 'E-1', 'F-1', 'F#-1', 'G-1' ])
    })
    it('chromatic note ranges', function () {
      assert.deepEqual(range(false, 'Db3', 'Gb3'),
        [ 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3' ])
      assert.deepEqual(range(true, 'Gb3', 'Db3'),
        [ 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C#3' ])
    })
    it('midi ranges', function () {
      assert.deepEqual(range(null, 60, 65), [ 60, 61, 62, 63, 64, 65 ])
      assert.deepEqual(range(null, 60, 55), [ 60, 59, 58, 57, 56, 55 ])
    })
    it('can be partially applied', function () {
      assert.deepEqual(range(null)(0, 4), [ 1, 2, 3, 4 ])
      assert.deepEqual(range(null, 0)(4), [ 1, 2, 3, 4 ])
    })
    it('always returns an array', function () {
      assert.deepEqual(range(null, null, null), [])
      assert.deepEqual(range({}, 'C2', 'C4'), [])
      assert.deepEqual(range(null, null, 'C4'), [])
    })
  })
})
