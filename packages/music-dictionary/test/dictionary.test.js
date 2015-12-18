/* global describe it */
var assert = require('assert')
var dictionary = require('..')

describe('music-dictionary', function () {
  describe('basic dictionary', function () {
    var chords = dictionary({'Maj7': ['1 3 5 7', ['maj7', 'M7']]})

    it('get by type and tonic', function () {
      assert.deepEqual(chords('Maj7', 'C'), ['C', 'E', 'G', 'B'])
      assert.deepEqual(chords('M7', 'C'), ['C', 'E', 'G', 'B'])
      assert.deepEqual(chords('maj7', 'C'), ['C', 'E', 'G', 'B'])
    })
    it('type with pitch class', function () {
      assert.deepEqual(chords('BbMaj7'), [ 'Bb', 'D', 'F', 'A' ])
      assert.deepEqual(chords('BbM7'), [ 'Bb', 'D', 'F', 'A' ])
      assert.deepEqual(chords('Bbmaj7'), [ 'Bb', 'D', 'F', 'A' ])
    })
    it('type with note', function () {
      assert.deepEqual(chords('Eb3Maj7'), [ 'Eb3', 'G3', 'Bb3', 'D4' ])
      assert.deepEqual(chords('Eb3M7'), [ 'Eb3', 'G3', 'Bb3', 'D4' ])
      assert.deepEqual(chords('Eb3maj7'), [ 'Eb3', 'G3', 'Bb3', 'D4' ])
    })
    it('get intervals', function () {
      assert.deepEqual(chords('Maj7', false), [ '1P', '3M', '5P', '7M' ])
      assert.deepEqual(chords('CMaj7', false), [ '1P', '3M', '5P', '7M' ])
    })
    it('without tonic', function () {
      assert.deepEqual(chords('Maj7')('G'), [ 'G', 'B', 'D', 'F#' ])
    })
    it('invalid values', function () {
      assert.deepEqual(chords('Cblah'), [])
      assert.deepEqual(chords('blah'), [])
      assert.deepEqual(chords(), [])
    })
  })
})
