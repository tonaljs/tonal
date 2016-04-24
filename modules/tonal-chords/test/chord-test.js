/* global describe it */
var assert = require('assert')
var chords = require('..')

describe('tonal-chords', function () {
  describe('data', function () {
    it('each name has intervals', function () {
      var id = function (e) { return e }
      chords.names(true).forEach(function (name) {
        if (!Array.isArray(chords.DATA[name])) return
        var ivls = chords.chord(name, false)
        var data = chords.DATA[name]
        assert.equal(data.length, ivls.length, 'Chord data: ' + name)
      })
    })
  })
  describe('chord', function () {
    var chord = chords.chord
    it('create chord from type and tonic', function () {
      assert.deepEqual(chord('7', 'C'), [ 'C', 'E', 'G', 'Bb' ])
      assert.deepEqual(chord('maj7', 'A4'), ['A4', 'C#5', 'E5', 'G#5'])
    })
    it('creates an chord from intervals', function () {
      assert.deepEqual(chord('1P 3M 5P', 'A4'), ['A4', 'C#5', 'E5'])
    })
    it('get chord intervals', function () {
      assert.deepEqual(chord('maj7', false), [ '1P', '3M', '5P', '7M' ])
      assert.deepEqual(chord('P1 M3 P5 M7', false), [ '1P', '3M', '5P', '7M' ])
    })
    it('is currified', function () {
      assert.deepEqual(chord('maj7', 'C'), chord('maj7')('C'))
    })
  })
  describe('fromName', function () {
    var fromName = chords.fromName
    it('creates an chord from names', function () {
      assert.deepEqual(fromName('Cmaj7'), [ 'C', 'E', 'G', 'B' ])
      assert.deepEqual(fromName('C7'), [ 'C', 'E', 'G', 'Bb' ])
      assert.deepEqual(fromName('C64'), ['G', 'C', 'E'])
    })
  })
  describe('names', function () {
    var names = chords.names
    it('has names', function () {
      assert(names().length > 0)
    })
    it('can return aliases', function () {
      assert(names(true).length > names().length)
    })
  })
})
