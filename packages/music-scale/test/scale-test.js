/* global describe it */
var assert = require('assert')
var scale = require('..')

describe('music-scale', function () {
  describe('scale.get', function () {
    it('creates a scale from name', function () {
      assert.deepEqual(scale.get('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(scale.get('Cmajor'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(scale.get('C2 major'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
    })
  })
  describe('scale', function () {
    it('create a scale from type and tonic', function () {
      assert.deepEqual(scale('major', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(scale('major', 'C2'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
    })
    it('creates a scale from intervals', function () {
      assert.deepEqual(scale('1 2 3 4 5 6 7', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    })
    it('intervals are simplified', function () {
      assert.deepEqual(scale('1 9 11', 'C2'), [ 'C2', 'D2', 'F2' ])
    })
    it('creates a scale from notes', function () {
      assert.deepEqual(scale('C D E F G A B', 'A'), [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ])
    })
    it('notes are converted to pitch classes', function () {
      assert.deepEqual(scale('C2 D4 G6', 'A2'), [ 'A2', 'B2', 'E3' ])
    })
    it('get scale intervals', function () {
      assert.deepEqual(scale('major', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
      assert.deepEqual(scale('C D E F G A B', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    })
  })
  describe('scale.names', function () {
    it('has names function', function () {
      assert(scale.names().length > 0)
      assert(scale.names(true).length > scale.names().length)
    })
  })
})
