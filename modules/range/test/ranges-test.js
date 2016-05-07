var tape = require('tape')
var range = require('../')

tape('from pitch set returns a note name', function (test) {
  test.deepEqual(range.fromPitchSet('C D E', 60), 'C4')
  test.end()
})

tape('from pitch set can be partially applied', function (test) {
  var aMajor = range.fromPitchSet('A C# E')
  test.deepEqual([69, 70, 71, 72, 73].map(aMajor),
    [ 'A4', null, null, null, 'C#5' ])
  test.end()
})

tape('cycle of fifths ascending', function (test) {
  test.deepEqual(range.cycleOfFifths(0, 6, 'C'),
    [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
  test.end()
})
tape('cycle of fifhts descending', function (test) {
  test.deepEqual(range.cycleOfFifths(0, -6, 'C'),
    [ 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ])
  test.end()
})
tape('ascending range', function (test) {
  test.deepEqual(range.range(0, 10),
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
  test.end()
})
tape('descending range', function (test) {
  test.deepEqual(range.range(10, 0),
    [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ])
  test.end()
})
tape('negative numbers', function (test) {
  test.deepEqual(range.range(0, -5), [ 0, -1, -2, -3, -4, -5 ])
  test.deepEqual(range.range(-5, -10), [ -5, -6, -7, -8, -9, -10 ])
  test.end()
})
tape('notes ascending', function (test) {
  test.deepEqual(range.range('C4', 'C5'),
    [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ])
  test.end()
})
tape('notes descending', function (test) {
  test.deepEqual(range.range('C5', 'C4'),
    [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ])
  test.end()
})
tape('ascending ranges', function (test) {
  test.deepEqual(range.chromatic('A3', 'A4'),
    [ 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4' ])
  test.end()
})
tape('descending ranges', function (test) {
  test.deepEqual(range.chromatic('A4', 'A3'),
    [ 'A4', 'Ab4', 'G4', 'Gb4', 'F4', 'E4', 'Eb4', 'D4', 'Db4', 'C4', 'B3', 'Bb3', 'A3' ])
  test.end()
})
tape('ascending range', function (test) {
  test.deepEqual(range.scaleRange('C D E', 'C2', 'C4'),
    [ 'C2', 'D2', 'E2', 'C3', 'D3', 'E3', 'C4' ])
  test.end()
})
tape('descending range', function (test) {
  test.deepEqual(range.scaleRange('C D E F G A B', 'C3', 'C2'),
    [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ])
  test.end()
})
