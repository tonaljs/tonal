var test = require('tape')
var range = require('../')

test('range: numeric - multiple notes in a string', function (t) {
  t.deepEqual(range.numeric('C2 F2 Bb1 C2'),
    [ 36, 37, 38, 39, 40, 41, 40, 39, 38, 37, 36, 35, 34, 35, 36 ])
  t.end()
})

test('range: fifths', function (t) {
  t.deepEqual(range.fifths('C', [0, 6]),
    [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
  t.deepEqual(range.fifths('C', [0, -6]),
    [ 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ])
  t.end()
})

test('range: numeric - numbers array', function (t) {
  t.deepEqual(range.numeric([0, 10]),
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
  t.deepEqual(range.numeric([10, 0]),
    [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ])
  t.deepEqual(range.numeric([0, -5]),
    [ 0, -1, -2, -3, -4, -5 ])
  t.deepEqual(range.numeric([-5, -10]),
    [ -5, -6, -7, -8, -9, -10 ])
  t.end()
})
test('range: numeric - notes array', function (t) {
  t.deepEqual(range.numeric('C4 C5'),
    [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ])
  t.deepEqual(range.numeric(['C5', 'C4']),
    [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ])
  t.end()
})
test('range: chromatic', function (t) {
  t.deepEqual(range.chromatic('A3 A4'),
    [ 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4' ])
  t.deepEqual(range.chromatic('A4 A3'),
    [ 'A4', 'Ab4', 'G4', 'Gb4', 'F4', 'E4', 'Eb4', 'D4', 'Db4', 'C4', 'B3', 'Bb3', 'A3' ])
  t.deepEqual(range.chromatic('C3 Eb3 A2'),
    [ 'C3', 'Db3', 'D3', 'Eb3', 'D3', 'Db3', 'C3', 'B2', 'Bb2', 'A2' ])
  t.deepEqual(range.chromatic('C3 Eb3 A2'), range.chromatic(['C3', 'Eb3', 'A2']))
  t.end()
})
test('range: chromatic - sharps', function (t) {
  t.deepEqual(range.chromatic('C2 C3', true),
    [ 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3' ])
  t.end()
})
test('range: pitchSet', function (t) {
  t.deepEqual(range.pitchSet('C D E', 'C2 C4'),
    [ 'C2', 'D2', 'E2', 'C3', 'D3', 'E3', 'C4' ])
  t.deepEqual(range.pitchSet('C D E F G A B', 'C3 C2'),
    [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ])
  t.end()
})
