/* global describe it */
var assert = require('assert')
var semitones = require('..')

describe('semitones', function () {
  it('get the size of intervals', function () {
    assert.deepEqual('1 2 3 4 5 6 7 8'.split(' ').map(semitones),
      [ 0, 2, 4, 5, 7, 9, 11, 12 ])
  })

  it('get size of notes', function () {
    assert.deepEqual('C0 C1 C2 C3 C4 C5 C6 C7'.split(' ').map(semitones),
      [ 0, 12, 24, 36, 48, 60, 72, 84 ])
  })

  it('get distances between notes', function () {
    assert.equal(semitones('d5') - semitones('c4'), 14)
  })

  it('get size of pitch classes', function () {
    assert.deepEqual('C D E F G A B C'.split(' ').map(semitones),
      [ 0, 2, 4, 5, 7, 9, 11, 0 ])
  })

  it('accepts pitches in array notation', function () {
    assert.equal(semitones([ 2 ]), 2)
    assert.equal(semitones([ 2, 0 ]), 14)
    assert.equal(semitones([ 2, 0, 4 ]), 14)
  })
})
