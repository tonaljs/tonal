
var test = require('tape')
var fr = require('..')

test('names', function (t) {
  t.ok(fr.names(true).length > fr.names(false).length)
  t.end()
})

test('tuning', function (t) {
  t.deepEqual(fr.tuning('guitar'),
    [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ])
  t.deepEqual(fr.tuning('charango'), [ 'G4', 'G4', 'C5', 'C5', 'E5', 'E4', 'A4', 'A4', 'E5', 'E5' ])
  t.end()
})

test('simple tuning', function (t) {
  t.deepEqual(fr.simpleTuning('guitar'), [ 'E', 'A', 'D', 'G', 'B', 'E' ])
  t.deepEqual(fr.simpleTuning('charango'), [ 'G', 'C', 'E', 'A', 'E' ])
  t.end()
})

test('build', function (t) {
  t.deepEqual(fr.build('E2 A2 D3', 0, 2),
    [ [ 'E2', 'F2', 'F#2' ], [ 'A2', 'Bb2', 'B2' ], [ 'D3', 'Eb3', 'E3' ] ])
  t.deepEqual(fr.build('guitar', 5, 7),
    [ [ 'A2', 'Bb2', 'B2' ], [ 'D3', 'Eb3', 'E3' ], [ 'G3', 'Ab3', 'A3' ],
      [ 'C4', 'Db4', 'D4' ], [ 'E4', 'F4', 'F#4' ], [ 'A4', 'Bb4', 'B4' ] ])
  t.end()
})

test('scale', function (t) {
  t.deepEqual(fr.scale('guitar', 'C E G', 0, 5),
    [ [ 'E2', null, null, 'G2', null, null ], [ null, null, null, 'C3', null, null ],
      [ null, null, 'E3', null, null, 'G3' ], [ 'G3', null, null, null, null, 'C4' ],
      [ null, 'C4', null, null, null, 'E4' ], [ 'E4', null, null, 'G4', null, null ] ])
  t.end()
})
