var tape = require('tape')
var chord = require('..')
var DATA = require('../chords.json')

tape('each name has intervals', function (test) {
  chord.chordNames(true).forEach(function (name) {
    if (!Array.isArray(DATA[name])) return
    var data = chord.chord(name, false)
    var filtered = data.filter(function (x) { return x })
    test.equal(data.length, filtered.length, 'Chord data: ' + name)
  })
  test.end()
})
tape('create chord from type and tonic', function (test) {
  test.deepEqual(chord.chord('7', 'C'), [ 'C', 'E', 'G', 'Bb' ])
  test.deepEqual(chord.chord('maj7', 'A4'), ['A4', 'C#5', 'E5', 'G#5'])
  test.end()
})
tape('creates an chord from intervals', function (test) {
  test.deepEqual(chord.chord('1P 3M 5P', 'A4'), ['A4', 'C#5', 'E5'])
  test.end()
})
tape('get chord intervals', function (test) {
  test.deepEqual(chord.chord('maj7', false), [ '1P', '3M', '5P', '7M' ])
  test.deepEqual(chord.chord('P1 M3 P5 M7', false), [ '1P', '3M', '5P', '7M' ])
  test.end()
})
tape('is currified', function (test) {
  test.deepEqual(chord.chord('maj7', 'C'), chord.chord('maj7')('C'))
  test.end()
})
tape('creates an chord from names', function (test) {
  test.deepEqual(chord.fromChordName('Cmaj7'), [ 'C', 'E', 'G', 'B' ])
  test.deepEqual(chord.fromChordName('C7'), [ 'C', 'E', 'G', 'Bb' ])
  test.deepEqual(chord.fromChordName('C64'), ['G', 'C', 'E'])
  test.end()
})
tape('has names', function (test) {
  tape(chord.chordNames().length > 0)
  test.end()
})
tape('can return aliases', function (test) {
  tape(chord.chordNames(true).length > chord.chordNames().length)
  test.end()
})
