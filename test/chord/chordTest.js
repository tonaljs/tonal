var vows = require('vows')
var assert = require('assert')
var chord = require('../../lib/chord/chord')
var names = require('../../lib/chord/names')

vows.describe('chord/chord').addBatch({
  'chord explicit tonic': function () {
    assert.deepEqual(chord('C', 'm7b5'), ['C4', 'Eb4', 'Gb4', 'Bb4'])
    assert.deepEqual(chord('C#', 'maj7'), ['C#4', 'E#4', 'G#4', 'B#4'])
    assert.deepEqual(chord('C#', 'AbMaj7'), ['C#4', 'E#4', 'G#4', 'B#4'])
  },
  'chord implicit tonic': function () {
    assert.deepEqual(chord('Aadd9'), ['A4', 'C#5', 'E5', 'B5'])
    assert.deepEqual(chord('Abadd9'), ['Ab4', 'C5', 'Eb5', 'Bb5'])
    assert.deepEqual(chord('Abbadd9'), ['Abb4', 'Cb5', 'Ebb5', 'Bbb5'])
  },
  'chord intervals': function () {
    assert.deepEqual(chord(null, '2'), ['1P', '3M', '5P', '9M'])
    assert.deepEqual(chord('add9'), [ '1P', '3M', '5P', '9M' ])
  },
  'all chords': function () {
    names().forEach(function (name) {
      assert(chord('B#', name) !== null, 'Chord ' + name + ' should exist.')
    })
  }

}).export(module)
