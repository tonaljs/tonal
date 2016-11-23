var test = require('tape')
var chord = require('..')
var DATA = require('../chords.json')

test('chord: detect', function (t) {
  t.deepEqual(chord.detect('c e g b'), [ 'CMaj7' ])
  t.deepEqual(chord.detect('e c a g'), [ 'CM6', 'Am7' ])
  t.deepEqual(chord.detect('g d f# b'), [ 'GMaj7' ])
  t.deepEqual(chord.detect('f a d g b'), [ 'Dm6', 'G9' ])
  t.deepEqual(chord.detect('f bb g d# a'), [ 'Gm9#5' ])
  t.end()
})

test('chord: chord data integrity', function (t) {
  chord.names(true).forEach(function (name) {
    console.log('name', name)
    if (!Array.isArray(DATA[name])) return
    var data = chord.get(name, false)
    var filtered = data.filter(function (x) { return x })
    t.equal(data.length, filtered.length, 'Chord data: ' + name)
  })
  t.end()
})

test('chord: parse', function (t) {
  t.deepEqual(chord.parse('Cmaj7'), { type: 'maj7', tonic: 'C' })
  t.deepEqual(chord.parse('C7'), { type: '7', tonic: 'C' })
  t.deepEqual(chord.parse('maj7'), { type: 'maj7', tonic: false })
  t.deepEqual(chord.parse('C#4 m7b5'), { type: 'm7b5', tonic: 'C#4' })
  t.deepEqual(chord.parse('C#4m7b5'), { type: 'm7b5', tonic: 'C#4' })
  // TODO: fix this
  t.deepEqual(chord.parse('C7b5'), { type: 'b5', tonic: 'C7' })
  t.end()
})

test('chord: get', function (t) {
  t.deepEqual(chord.get('maj7#5', 'D'), [ 'D', 'F#', 'A#', 'C#' ])
  t.end()
})

test('chord: notes', function (t) {
  t.deepEqual(chord.notes('Cmaj7'), [ 'C', 'E', 'G', 'B' ])
  t.deepEqual(chord.notes('C4 maj7'), [ 'C4', 'E4', 'G4', 'B4' ])
  t.deepEqual(chord.notes('C7'), [ 'C', 'E', 'G', 'Bb' ])
  t.deepEqual(chord.notes('C64'), ['G', 'C', 'E'])
  t.deepEqual(chord.notes('Cmaj7#5'), [ 'C', 'E', 'G#', 'B' ])
  t.deepEqual(chord.notes('e4 c5 g2'), ['E4', 'C5', 'G2'])
  t.end()
})

test('chord: inversion', function (t) {
  t.deepEqual(chord.inversion(0, 'e g c'), [ 'C', 'E', 'G' ])
  t.deepEqual(chord.inversion(1, 'e g c'), [ 'E', 'G', 'C' ])
  t.deepEqual(chord.inversion(2, 'e g c'), [ 'G', 'C', 'E' ])
  t.deepEqual(chord.inversion(0)('b g e d c'), [ 'C', 'E', 'G', 'B', 'D' ])
  t.deepEqual(chord.inversion(3, 'CMaj7#5'), [ 'B', 'C', 'E', 'G#' ])
  t.end()
})

test('chord: names', function (t) {
  test(chord.names().length > 0)
  test(chord.names(true).length > chord.names().length)
  t.end()
})
