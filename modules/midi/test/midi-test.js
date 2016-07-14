var test = require('tape')
var note = require('..')
var map = function (fn, s) {
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

test('isMidi accepts numbers', function (t) {
  t.deepEqual(map(note.isMidiNum, [-1, 0, 127, 128]),
  [ false, true, true, false ])
  t.end()
})
test('arrays are not midi', function (t) {
  t.equal(note.isMidiNum([4]), false)
  t.equal(note.isMidiNum(null), false)
  t.equal(note.isMidiNum(), false)
  t.end()
})
test('get midi from notes', function (t) {
  t.deepEqual(map(note.toMidi, 'C4 D4 E4 F4 G4 A4 B4 C5'),
  [ 60, 62, 64, 65, 67, 69, 71, 72 ])
  t.deepEqual(map(note.toMidi, 'C4 B#3 Dbb4'), [60, 60, 60])
  t.end()
})
test('pitch classes do not have midi', function (t) {
  t.deepEqual(map(note.toMidi, 'C D E F G A B'),
  [ null, null, null, null, null, null, null ])
  t.end()
})
test('toMidi of midi values returns the value', function (t) {
  t.equal(note.toMidi(72), 72)
  t.ok(note.toMidi('60') === 60)
  t.end()
})
test('toMidi invalid values returns null', function (t) {
  t.equal(note.toMidi(null), null)
  t.equal(note.toMidi(-1), null)
  t.equal(note.toMidi(128), null)
  t.end()
})
test('toMidi accepts pitch in array notation', function (t) {
  t.equal(note.toMidi([0, 4]), 60)
  t.equal(note.toMidi([3, 3]), 69)
  // pitch classes doesn't have midi
  t.equal(note.toMidi([5]), null)
  t.end()
})
test('get pitch names from midi numbers', function (t) {
  t.deepEqual(map(note.fromMidi, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
  t.end()
})
test('get pitch names from midi numbers with sharps altered notes', function (t) {
  t.deepEqual(map(note.fromMidiS, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ])
  t.end()
})
