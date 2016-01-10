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

  it('has names function', function () {
    assert(scale.names().length > 0)
    assert(scale.names(true).length > scale.names().length)
  })

  it('has props function', function () {
    assert.deepEqual(scale.props('major'), { name: 'major',
      aliases: [ 'ionian' ],
      intervals: [ '1', '2', '3', '4', '5', '6', '7' ],
      steps: [ [ 0, 0 ], [ 2, -1 ], [ 4, -2 ], [ -1, 1 ], [ 1, 0 ], [ 3, -1 ], [ 5, -2 ] ],
      binary: '101011010101', decimal: 2773 })
  })
})
