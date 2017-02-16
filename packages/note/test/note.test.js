/* global describe test expect */
var note = require('..')

describe('tonal-note', () => {
  test('step', () => {
    expect('c d e f g a b'.split(' ').map(note.step)).toEqual([ 0, 1, 2, 3, 4, 5, 6 ])
    expect('c# d## e### f####'.split(' ').map(note.step)).toEqual([ 0, 1, 2, 3 ])
  })

  test('oct', () => {
    expect('a-2 b-1 c0 d1 e2 f3 g4 a5 b6 c7 d8 c9 d10'.split(' ').map(note.oct)).toEqual([ -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
    expect('c d e f g'.split(' ').map(note.oct)).toEqual([ undefined, undefined, undefined, undefined, undefined ])
    expect(note.oct('blah') === null).toBeTruthy()
    expect(note.oct(['tnlp', [2, 0]])).toBe(1)
  })

  test('midi', () => {
    expect('c4 d4 e4 f4 g4 a4 b4 c4'.split(' ').map(note.midi)).toEqual([ 60, 62, 64, 65, 67, 69, 71, 60 ])
  })

  test('chroma', () => {
    expect('Cb C Db D Eb E Fb F Gb G Ab A Bb B'.split(' ').map(note.chroma)).toEqual([ 11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11 ])
    expect('C C# D D# E E# F F# G G# A A# B B#'.split(' ').map(note.chroma)).toEqual([ 0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 0 ])
  })

  test('note', () => {
    expect('c fx dbb bbb c##-1 fbb6'.split(' ').map(note.note)).toEqual([ 'C', 'F##', 'Dbb', 'Bbb', 'C##-1', 'Fbb6' ])
  })

  test('pc', () => {
    expect('a b0 d2 e# fb3 g###4 bbbb5 h j'.split(' ').map(note.pc)).toEqual([ 'A', 'B', 'D', 'E#', 'Fb', 'G###', 'Bbbb', null, null ])
  })

  test('fromProps', () => {
    expect(note.fromProps({ step: 1, alt: -1, oct: 2 })).toBe('Db2')
    expect(note.fromProps({ step: 4, alt: 1 })).toBe('G#')
    expect(note.fromProps({ step: 1 })).toBe('D')
    expect(note.fromProps({})).toBe(null)
    expect(note.fromProps()).toBe(null)
  })
})
