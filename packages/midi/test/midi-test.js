var test = require('tape')
var midi = require('..')
var map = function (fn, s) {
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

test('midi: toMidi - map note names to note numbers', function (t) {
  t.deepEqual(map(midi.toMidi, 'C4 D4 E4 F4 G4 A4 B4 C5'),
  [ 60, 62, 64, 65, 67, 69, 71, 72 ])
  t.deepEqual(map(midi.toMidi, 'C4 B#3 Dbb4'), [60, 60, 60])
  t.end()
})
test('midi: toMidi - pitch classes do not have midi', function (t) {
  t.deepEqual(map(midi.toMidi, 'C D E F G A B'),
  [ null, null, null, null, null, null, null ])
  t.end()
})
test('midi: toMidi - midi numbers are bypassed', function (t) {
  t.equal(midi.toMidi(72), 72)
  t.ok(midi.toMidi('60') === 60)
  t.end()
})
test('midi: toMidi - invalid values', function (t) {
  t.equal(midi.toMidi(null), null)
  t.equal(midi.toMidi(-1), null)
  t.equal(midi.toMidi(128), null)
  t.end()
})
test('midi: toMidi - accepts pitch in array notation', function (t) {
  t.equal(midi.toMidi([0, 4]), 60)
  t.equal(midi.toMidi([3, 3]), 69)
  // pitch classes doesn't have midi
  t.equal(midi.toMidi([5]), null)
  t.end()
})
test('midi: note - get names from midi numbers', function (t) {
  t.deepEqual(map(midi.note, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
  t.end()
})
test('midi: note with type', function (t) {
  t.deepEqual(midi.note(61, false), 'Db4')
  t.deepEqual(midi.note(false)(61), 'Db4')
  t.deepEqual(midi.note(61, true), 'C#4')
  t.deepEqual(midi.note(true)(61), 'C#4')
  t.end()
})
test('midi: note - partially applied with true', function (t) {
  t.deepEqual(map(midi.note(true), [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ])
  t.end()
})
