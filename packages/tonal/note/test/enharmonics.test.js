/* global describe test expect */
var note = require('..')

describe('tonal-enharmonics', () => {
  test('enharmonics', () => {
    expect(note.enharmonics('C')).toEqual([ 'B#', 'C', 'Dbb' ])
    expect(note.enharmonics('B')).toEqual([ 'A##', 'B', 'Cb' ])
    expect(note.enharmonics('B#')).toEqual([ 'A###', 'B#', 'C' ])
    expect(note.enharmonics('F5')).toEqual([ 'E#5', 'F5', 'Gbb5' ])
    expect(note.enharmonics('E#2')).toEqual([ 'D###2', 'E#2', 'F2' ])
    expect(note.enharmonics('A###6')).toEqual([ 'G#####6', 'A###6', 'B#6' ])
    expect(note.enharmonics('A')).toEqual([ 'G##', 'A', 'Bbb' ])
    expect(note.enharmonics('Ab3')).toEqual([ 'G#3', 'Ab3', 'Bbbb3' ])
    expect(note.enharmonics('Db')).toEqual([ 'C#', 'Db', 'Ebbb' ])
  })

  test('enharmonics - returns empty array if not valid pitch', () => {
    expect(note.enharmonics('blah')).toBe(null)
  })

  test('enharmonics - pitch in array notation', () => {
    var C = ['tnlp', [0]]
    expect(note.enharmonics(C)).toEqual(
      [ [ 'tnlp', [ 12 ] ], [ 'tnlp', [ 0 ] ], [ 'tnlp', [ -12 ] ] ])
  })

  test('simplify', () => {
    expect(note.simplify('E#2')).toEqual('F2')
    expect(note.simplify('B#2')).toEqual('C3')
    expect(note.simplify('Cb2')).toEqual('B1')
    // strage case: not a COMPLETE simplification, but I think is enough
    expect(note.simplify('A###6')).toEqual('B#6')
  })
})
