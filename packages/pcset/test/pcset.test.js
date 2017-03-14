/* global describe test expect */
var pcset = require('..')

describe('tonal-pcset', () => {
  test('notes', () => {
    expect(pcset.notes('g4 f5 g3 d3 a3 a4 c6 a1')).toEqual([ 'G', 'A', 'C', 'D', 'F' ])
  })
  test('notes always return an array', () => {
    expect(pcset.notes('blah blip')).toEqual([])
    expect(pcset.notes()).toEqual([])
  })

  test('chroma', () => {
    expect(pcset.chroma('c d e')).toBe('101010000000')
    expect(pcset.chroma('g g#4 a bb5')).toBe('000000011110')
    expect(pcset.chroma('P1 M2 M3 P4 P5 M6 M7')).toBe(pcset.chroma('c d e f g a b'))
    expect(pcset.chroma('101010101010')).toBe('101010101010')
  })

  test('fromChroma', () => {
    expect(pcset.fromChroma('101010101010', 'C')).toEqual([ 'C', 'D', 'E', 'Gb', 'Ab', 'Bb' ])
    expect(pcset.fromChroma('101010101010', null)).toEqual([ '1P', '2M', '3M', '5d', '6m', '7m' ])
    expect(pcset.fromChroma('100000100001')('Eb')).toEqual(['Eb', 'Bbb', 'D'])
    expect(pcset.fromChroma('1010', 'D')).toEqual(null)
  })

  test('modes', () => {
    // TODO: fixme, the 4th mode should have F# instead of Gb
    expect(pcset.chromaModes('c d e f g a b').map(function (chroma, i) {
      return pcset.fromChroma(chroma, 'C')
    })).toEqual([ [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ],
    [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ],
    [ 'C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb' ],
    [ 'C', 'D', 'E', 'Gb', 'G', 'A', 'B' ],
    [ 'C', 'D', 'E', 'F', 'G', 'A', 'Bb' ],
    [ 'C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb' ],
    [ 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb' ] ])
  })

  test('isChroma', () => {
    expect(pcset.isChroma('101010101010')).toBe(true)
    expect(pcset.isChroma('1010101')).toBe(false)
    expect(pcset.isChroma('blah')).toBe(false)
    expect(pcset.isChroma('c d e')).toBe(false)
  })

  test('subset', () => {
    expect(pcset.subset('c4 d5 e6', 'c2 d3')).toBe(true)
    expect(pcset.subset('c4 d5 e6', 'c2 d3 e5')).toBe(true)
    expect(pcset.subset('c d e', 'c d e f')).toBe(false)
    expect(pcset.subset('c d e')('c2 d3 f6')).toBe(false)
  })

  test('superset', () => {
    expect(pcset.superset('c d e', 'c2 d3 e4 f5')).toBe(true)
    expect(pcset.superset('c d e', 'e f g')).toBe(false)
    expect(pcset.superset('c d e')('d e')).toBe(false)
  })

  test('equal', () => {
    expect(pcset.equal('c2 d3 e7 f5', 'c4 c d5 e6 f1')).toBeTruthy()
    expect(pcset.equal('c f')('c4 c f1')).toBeTruthy()
  })

  test('includes', () => {
    expect(pcset.includes('c d e', 'C4')).toBe(true)
    expect(pcset.includes('c d e', 'C#4')).toBe(false)
  })

  test('filter', () => {
    expect(pcset.filter('c d e', 'c2 c#2 d2 c3 c#3 d3')).toEqual([ 'c2', 'd2', 'c3', 'd3' ])
    expect(pcset.filter('c')('c2 c#2 d2 c3 c#3 d3')).toEqual([ 'c2', 'c3' ])
  })

  test('chromaModes', () => {
    expect(pcset.chromaModes('c d e f g a b')).toEqual([
      '101011010101', '101101010110', '110101011010', '101010110101',
      '101011010110', '101101011010', '110101101010' ])
    expect(pcset.chromaModes('c d e f g a b', false)).toEqual([
      '101011010101', '010110101011', '101101010110', '011010101101',
      '110101011010', '101010110101', '010101101011', '101011010110',
      '010110101101', '101101011010', '011010110101', '110101101010' ])
    expect(pcset.chromaModes('blah bleh')).toEqual([])
  })
})
