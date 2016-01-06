/* global describe it */
var assert = require('assert')
var range = require('..')

describe('note-range', function () {
  it('creates ascending ranges', function () {
    assert.deepEqual(range('g3', 'C4'), ['G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4'])
  })
  it('creates descending ranges', function () {
    assert.deepEqual(range('c4', 'g3'), ['C4', 'B3', 'Bb3', 'A3', 'Ab3', 'G3'])
  })
  it('accepts step size', function () {
    assert.deepEqual(range('g3', 'C4', 2), ['G3', 'A3', 'B3', 'Db4'])
    assert.deepEqual(range('c4', 'g3', 2), ['Db4', 'B3', 'A3', 'G3'])
  })
  it('step size direction is ignored', function () {
    assert.deepEqual(range('g3', 'C4', -2), ['G3', 'A3', 'B3', 'Db4'])
    assert.deepEqual(range('c4', 'g3', -2), ['Db4', 'B3', 'A3', 'G3'])
  })
})
