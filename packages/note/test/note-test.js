var test = require('tape')
var note = require('..')

test('note: step', function (t) {
  t.deepEqual('c d e f g a b'.split(' ').map(note.step), [ 0, 1, 2, 3, 4, 5, 6 ])
  t.deepEqual('c# d## e### f####'.split(' ').map(note.step), [ 0, 1, 2, 3 ])
  t.end()
})

test('note: oct', function (t) {
  t.deepEqual('a-2 b-1 c0 d1 e2 f3 g4 a5 b6 c7 d8 c9 d10'.split(' ').map(note.oct),
    [ -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
  t.deepEqual('c d e f g'.split(' ').map(note.oct), [ undefined, undefined, undefined, undefined, undefined ])
  t.ok(note.oct('blah') === null)
  t.equal(note.oct(['tnlp', [2, 0]]), 1)
  t.end()
})

test('note: chroma', function (t) {
  t.deepEqual('Cb C Db D Eb E Fb F Gb G Ab A Bb B'.split(' ').map(note.chroma),
    [ 11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11 ])
  t.deepEqual('C C# D D# E E# F F# G G# A A# B B#'.split(' ').map(note.chroma),
    [ 0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 0 ])
  t.end()
})

test('note: note', function (t) {
  t.deepEqual('c fx dbb bbb c##-1 fbb6'.split(' ').map(note.note),
    [ 'C', 'F##', 'Dbb', 'Bbb', 'C##-1', 'Fbb6' ])
  t.end()
})

test('note: pc', function (t) {
  t.deepEqual('a b0 d2 e# fb3 g###4 bbbb5 h j'.split(' ').map(note.pc),
    [ 'A', 'B', 'D', 'E#', 'Fb', 'G###', 'Bbbb', null, null ])
  t.end()
})

test('note: fromProps', function (t) {
  t.equal(note.fromProps({ step: 1, alt: -1, oct: 2 }), 'Db2')
  t.equal(note.fromProps({ step: 4, alt: 1 }), 'G#')
  t.equal(note.fromProps({ step: 1 }), 'D')
  t.equal(note.fromProps({}), null)
  t.equal(note.fromProps(), null)
  t.end()
})
