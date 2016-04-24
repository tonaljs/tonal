/* global describe it */
var assert = require('assert')
var tonal = require('..')

describe('tonal-scales', function () {
  describe('fromName', function () {
    var fromName = tonal.fromName
    it('creates a scale from name', function () {
      assert.deepEqual(fromName('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
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
    it('create a scale from alias and tonic', function () {
      assert.deepEqual(scale('ionian', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    })
    it('always returns an array', function () {
      assert.deepEqual(scale('no-scale', 'D'), [])
    })
  })
  describe('names', function () {
    var names = tonal.names
    it('has names function', function () {
      assert(names().length > 0)
    })
    it('names aliases are bigger than simple names', function () {
      assert(names(true).length > tonal.names().length)
    })
  })
})
