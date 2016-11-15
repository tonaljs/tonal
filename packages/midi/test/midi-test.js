var test = require('tape')
var midi = require('..')
var map = function (fn, s) {
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

test('midi: isValidNote', function (t) {
  t.deepEqual(map(midi.isValidNote, [-1, 0, 127, 128]),
  [ false, true, true, false ])
  t.equal(midi.isValidNote([4]), false)
  t.equal(midi.isValidNote(null), false)
  t.equal(midi.isValidNote(), false)
  t.end()
})

test('midi: fromNote - map note names to note numbers', function (t) {
  t.deepEqual(map(midi.fromNote, 'C4 D4 E4 F4 G4 A4 B4 C5'),
  [ 60, 62, 64, 65, 67, 69, 71, 72 ])
  t.deepEqual(map(midi.fromNote, 'C4 B#3 Dbb4'), [60, 60, 60])
  t.end()
})
test('midi: fromNote - pitch classes do not have midi', function (t) {
  t.deepEqual(map(midi.fromNote, 'C D E F G A B'),
  [ null, null, null, null, null, null, null ])
  t.end()
})
test('midi: fromNote - midi numbers are bypassed', function (t) {
  t.equal(midi.fromNote(72), 72)
  t.ok(midi.fromNote('60') === 60)
  t.end()
})
test('midi: fromNote - invalid values', function (t) {
  t.equal(midi.fromNote(null), null)
  t.equal(midi.fromNote(-1), null)
  t.equal(midi.fromNote(128), null)
  t.end()
})
test('midi: fromNote - accepts pitch in array notation', function (t) {
  t.equal(midi.fromNote([0, 4]), 60)
  t.equal(midi.fromNote([3, 3]), 69)
  // pitch classes doesn't have midi
  t.equal(midi.fromNote([5]), null)
  t.end()
})
test('midi: toNote - get names from midi numbers', function (t) {
  t.deepEqual(map(midi.toNote, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
  t.end()
})
test('midi: toNote with type', function (t) {
  t.deepEqual(midi.toNote(61, false), 'Db4')
  t.deepEqual(midi.toNote(false)(61), 'Db4')
  t.deepEqual(midi.toNote(61, true), 'C#4')
  t.deepEqual(midi.toNote(true)(61), 'C#4')
  t.end()
})
test('midi: toNote - partially applied with true', function (t) {
  t.deepEqual(map(midi.toNote(true), [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ])
  t.end()
})
