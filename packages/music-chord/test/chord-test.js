/* global describe it */
var assert = require('assert')
var chord = require('..')

describe('music-chord', function () {
  it('creates an chord from intervals', function () {
    assert.deepEqual(chord('1 3 5', 'A4'), ['A4', 'C#5', 'E5'])
  })

  it('creates an chord from names', function () {
    assert.deepEqual(chord('maj7', 'A4'), ['A4', 'C#5', 'E5', 'G#5'])
    assert.deepEqual(chord('Cmaj7'), [ 'C', 'E', 'G', 'B' ])
  })

  it('get intervals if tonic is false', function () {
    assert.deepEqual(chord('maj7', false), [ '1P', '3M', '5P', '7M' ])
    assert.deepEqual(chord('1 3 5 7', false), [ '1P', '3M', '5P', '7M' ])
    assert.deepEqual(chord('C E G B', false), [ '1P', '3M', '5P', '7M' ])
  })

  it('is currified', function () {
    assert.deepEqual(chord('maj7', 'C'), chord('maj7')('C'))
  })
})
