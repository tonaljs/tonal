/* global describe it */
var assert = require('assert')
var scale = require('..')

describe('music-scale', function () {
  it('creates a scale from name', function () {
    assert.deepEqual(scale('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    assert.deepEqual(scale('major', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  })

  it('creates a scale from intervals', function () {
    assert.deepEqual(scale('1 2 3 4 5 6 7', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  })

  it('creates a scale from notes', function () {
    assert.deepEqual(scale('C D E F G A B', 'A'), [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ])
  })

  it('get scale intervals', function () {
    assert.deepEqual(scale('major', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    assert.deepEqual(scale('C D E F G A B', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  })
})
