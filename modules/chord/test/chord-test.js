var tape = require('tape')
var chord = require('..')
var DATA = require('../chords.json')

tape('chord data integrity', function (test) {
  chord.names(true).forEach(function (name) {
    if (!Array.isArray(DATA[name])) return
    var data = chord.build(name, false)
    var filtered = data.filter(function (x) { return x })
    test.equal(data.length, filtered.length, 'Chord data: ' + name)
  })
  test.end()
})

tape('build chord', function (test) {
  test.deepEqual(chord.build('7', 'C'), [ 'C', 'E', 'G', 'Bb' ])
  test.deepEqual(chord.build('maj7', 'A4'), ['A4', 'C#5', 'E5', 'G#5'])
  test.deepEqual(chord.build('1P 3M 5P', 'A4'), ['A4', 'C#5', 'E5'])
  test.deepEqual(chord.build('maj7', false), [ '1P', '3M', '5P', '7M' ])
  test.deepEqual(chord.build('P1 M3 P5 M7', false), [ '1P', '3M', '5P', '7M' ])
  test.deepEqual(chord.build('maj7', 'C'), chord.build('maj7')('C'))
  test.end()
})

tape('creates an chord from names', function (test) {
  test.deepEqual(chord.get('Cmaj7'), [ 'C', 'E', 'G', 'B' ])
  test.deepEqual(chord.get('C7'), [ 'C', 'E', 'G', 'Bb' ])
  test.deepEqual(chord.get('C64'), ['G', 'C', 'E'])
  test.end()
})
tape('has names', function (test) {
  tape(chord.names().length > 0)
  tape(chord.names(true).length > chord.names().length)
  test.end()
})
