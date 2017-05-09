/* global describe test expect */
var p = require('..')

describe('tonal-pitch', () => {
  test('pitch', () => {
    expect(p.pitch(2, 2)).toEqual(['tnlp', [2, 2]])
    expect(p.pitch(2, 2, -1)).toEqual(['tnlp', [2, 2], -1])
  })
  test('get fifths from pitch object', () => {
    expect(p.fifths(p.parseIvl('2M'))).toBe(2)
    expect(p.fifths(p.parseIvl('-2M'))).toBe(-2)
  })

  test('get focts from pitch object', () => {
    expect(p.focts(p.parseIvl('2M'))).toBe(-1)
    expect(p.focts(p.parseIvl('-2M'))).toBe(1)
  })

  test('get dir from pitch object', () => {
    expect(p.dir(p.parseIvl('2M'))).toBe(1)
    expect(p.dir(p.parseIvl('-2M'))).toBe(-1)
    expect(p.dir(p.parseNote('C4'))).toBe(1)
    expect(p.dir(p.parseNote('C-1'))).toBe(1)
  })

  test('get chroma from a pitch object', () => {
    expect('Cb C Db D Eb E Fb F Gb G Ab A Bb B'.split(' ').map(p.parseNote).map(p.chr))
    .toEqual([ 11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11 ])
    expect('P1 M2 M3 P4 P5 M6 M7'.split(' ').map(p.parseIvl).map(p.chr))
    .toEqual([ 0, 2, 4, 5, 7, 9, 11 ])
    expect('-1P -2M -3M -4P -5P -6M -7M'.split(' ').map(p.parseIvl).map(p.chr))
    .toEqual([ 0, 10, 8, 7, 5, 3, 1 ])
  })

  test('parse note', () => {
    expect(p.parseNote('Cb4')).toEqual([ 'tnlp', [ -7, 8 ] ])
  })

  test('parse interval', () => {
    expect(p.parseIvl('10m')).toEqual([ 'tnlp', [ -3, 3 ], 1 ])
    expect(p.parseIvl('m10')).toEqual([ 'tnlp', [ -3, 3 ], 1 ])
    expect(p.parseIvl('3M')).toEqual([ 'tnlp', [ 4, -2 ], 1 ])
    expect(p.parseIvl('-3M')).toEqual([ 'tnlp', [ 4, -2 ], -1 ])
  })

  test('parse pitch', () => {
    expect(p.parsePitch('Cb4')).toEqual(p.parseNote('Cb4'))
    expect(p.parsePitch('A11')).toEqual(p.parseNote('A11'))
    expect(p.parsePitch('11A')).toEqual(p.parseIvl('A11'))
  })

  test('note to string', () => {
    function id (n) { return p.strNote(p.parseNote(n)) }
    expect('a c db2 e#4 fx6 gbbb ab#9'.split(' ').map(id))
    .toEqual([ 'A', 'C', 'Db2', 'E#4', 'F##6', 'Gbbb', null ])
  })

  test('interval to string', () => {
    function id (i) { return p.strIvl(p.parseIvl(i)) }
    expect('1P 2M 3M 4P 5P 6M 7M'.split(' ').map(id))
    .toEqual([ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    expect('1d 2m 3m 4d 5d 6m 7m'.split(' ').map(id))
    .toEqual([ '1d', '2m', '3m', '4d', '5d', '6m', '7m' ])
    expect('8A 9A 10A 11A 12A 13A 14A'.split(' ').map(id))
    .toEqual([ '8A', '9A', '10A', '11A', '12A', '13A', '14A' ])
    expect('-1P -2M -3M -4P -5P -6M -7M'.split(' ').map(id))
    .toEqual([ '-1P', '-2M', '-3M', '-4P', '-5P', '-6M', '-7M' ])
    expect('-8d -9m -10m -11d -12d -13m -14m'.split(' ').map(id))
    .toEqual([ '-8d', '-9m', '-10m', '-11d', '-12d', '-13m', '-14m' ])
  })
})
