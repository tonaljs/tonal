/* global describe it */
var assert = require('assert')
var tonal = require('..')

describe('tonal-scales', function () {
  describe.skip('fromName', function () {
    var fromName = tonal.fromName
    it.skip('creates a scale from name', function () {
      assert.deepEqual(fromName('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(fromName('Cmajor'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(fromName('C2 major'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
    })
  })
  describe('scale', function () {
    var scale = tonal.scale
    it('can be partially applied', function () {
      assert.deepEqual(scale('major')('Db'), [ 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C' ])
    })
    it('create a scale from type and tonic', function () {
      assert.deepEqual(scale('major', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(scale('major', 'C2'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
    })
    it('get scale intervals from name', function () {
      assert.deepEqual(scale('major', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    })
    it.skip('create a scale from alias and tonic', function () {
      assert.deepEqual(scale('ionian', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    })
    it.skip('creates a scale from intervals', function () {
      assert.deepEqual(scale('1 2 3 4 5 6 7', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    })
    it.skip('intervals are simplified', function () {
      assert.deepEqual(scale('1 9 11', 'C2'), [ 'C2', 'D2', 'F2' ])
    })
    it.skip('creates a scale from notes', function () {
      assert.deepEqual(scale('C D E F G A B', 'A'), [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ])
    })
    it.skip('notes are converted to pitch classes', function () {
      assert.deepEqual(scale('C2 D4 G6', 'A2'), [ 'A2', 'B2', 'E3' ])
    })
    it.skip('get scale intervals', function () {
      assert.deepEqual(scale('major', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
      assert.deepEqual(scale('C D E F G A B', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    })
  })
  describe('names', function () {
    var names = tonal.names
    it('has names function', function () {
      assert(names().length > 0)
      // assert(names(true).length > tonal.names().length)
    })
  })
})
