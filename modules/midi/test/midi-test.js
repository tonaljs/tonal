var tape = require('tape')
var note = require('..')
var map = function (fn, s) {
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

tape('isMidi accepts numbers', function (test) {
  test.deepEqual(map(note.isMidiNum, [-1, 0, 127, 128]),
  [ false, true, true, false ])
  test.end()
})
tape('arrays are not midi', function (test) {
  test.equal(note.isMidiNum([4]), false)
  test.equal(note.isMidiNum(null), false)
  test.equal(note.isMidiNum(), false)
  test.end()
})
tape('get midi from notes', function (test) {
  test.deepEqual(map(note.toMidi, 'C4 D4 E4 F4 G4 A4 B4 C5'),
  [ 60, 62, 64, 65, 67, 69, 71, 72 ])
  test.deepEqual(map(note.toMidi, 'C4 B#3 Dbb4'), [60, 60, 60])
  test.end()
})
tape('pitch classes do not have midi', function (test) {
  test.deepEqual(map(note.toMidi, 'C D E F G A B'),
  [ null, null, null, null, null, null, null ])
  test.end()
})
tape('toMidi of midi values returns the value', function (test) {
  test.equal(note.toMidi(72), 72)
  test.ok(note.toMidi('60') === 60)
  test.end()
})
tape('toMidi invalid values returns null', function (test) {
  test.equal(note.toMidi(null), null)
  test.equal(note.toMidi(-1), null)
  test.equal(note.toMidi(128), null)
  test.end()
})
tape('get pitch names from midi numbers', function (test) {
  test.deepEqual(map(note.fromMidi, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ])
  test.end()
})
tape('get pitch names from midi numbers with sharps altered notes', function (test) {
  test.deepEqual(map(note.fromMidiS, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]),
  [ 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ])
  test.end()
})
