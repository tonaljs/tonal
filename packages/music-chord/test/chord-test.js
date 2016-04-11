/* global describe it */
var assert = require('assert')
var chord = require('..')

describe('music-chord', function () {
  describe('chord', function () {
    it('create chord from type and tonic', function () {
      assert.deepEqual(chord('7', 'C'), [ 'C', 'E', 'G', 'Bb' ])
      assert.deepEqual(chord('maj7', 'A4'), ['A4', 'C#5', 'E5', 'G#5'])
    })
    it('creates an chord from intervals', function () {
      assert.deepEqual(chord('1 3 5', 'A4'), ['A4', 'C#5', 'E5'])
    })
    it('get chord intervals', function () {
      assert.deepEqual(chord('maj7', false), [ '1P', '3M', '5P', '7M' ])
      assert.deepEqual(chord('1 3 5 7', false), [ '1P', '3M', '5P', '7M' ])
      assert.deepEqual(chord('C E G B', false), [ '1P', '3M', '5P', '7M' ])
    })

    it('is currified', function () {
      assert.deepEqual(chord('maj7', 'C'), chord('maj7')('C'))
    })
  })
  describe('chord.get', function () {
    it('creates an chord from names', function () {
      assert.deepEqual(chord.get('Cmaj7'), [ 'C', 'E', 'G', 'B' ])
      assert.deepEqual(chord.get('C7'), [ 'C', 'E', 'G', 'Bb' ])
      // TODO: 64 it's an interval. Limit interval size
      assert.deepEqual(chord.get('C64'), ['C'])
    })
  })
  describe('chord.names', function () {
    it('has names', function () {
      assert(chord.names().length > 0)
    })
    it('can return aliases', function () {
      assert(chord.names(true).length > chord.names().length)
    })
  })
})
