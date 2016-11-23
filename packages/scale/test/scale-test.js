var test = require('tape')
var scale = require('..')

test('scale: notes', function (t) {
  t.deepEqual(scale.notes('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  t.deepEqual(scale.notes('C2 major'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
  t.deepEqual(scale.notes('Eb bebop'), [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ])
  t.deepEqual(scale.notes('d4 e5 g3 c6 d5'), ['D', 'E', 'G', 'C'])
  t.end()
})

test('scale: get', function (t) {
  t.deepEqual(scale.get('major', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  t.deepEqual(scale.get('major', 'C2'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
  // alias
  t.deepEqual(scale.get('ionian', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  // intervals
  t.deepEqual(scale.get('major', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  // partially applied
  t.deepEqual(scale.get('major')('Db3'), [ 'Db3', 'Eb3', 'F3', 'Gb3', 'Ab3', 'Bb3', 'C4' ])
  // not found
  t.deepEqual(scale.get('no-scale', 'D'), null)
  t.end()
})

test('scale: names', function (t) {
  t.ok(scale.names().length > 0)
  t.ok(scale.names(true).length > scale.names().length)
  t.end()
})

test('scale: detect', function (t) {
  t.deepEqual(scale.detect('f3 a c5 e2 d g2 b6'), [
    'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian',
    'A aeolian', 'B locrian'])
  t.end()
})
