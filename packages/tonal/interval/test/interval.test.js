/* global describe test expect */
var ivl = require('..')

function map (fn, arr) {
  return (Array.isArray(arr) ? arr : arr.split(' ')).map(fn)
}

describe('tonal-interval', () => {
  test('toInterval - get interval names', () => {
    expect(map(ivl.toInterval, '1P 2M m3 P-4 5 blah')).toEqual([ '1P', '2M', '3m', '-4P', null, null ])
  })

  test('toInterval - invalid intervals', () => {
    expect(ivl.toInterval('blah')).toBe(null)
    expect(ivl.toInterval('P9')).toBe(null)
  })

  test('props', () => {
    expect(map(ivl.props, '1P 2M m2 m-2 P-4 5 blah M9 m9 M-9 -9m')).toEqual([ { alt: 0, dir: 1, num: 1 }, { alt: 0, dir: 1, num: 2 },
      { alt: -1, dir: 1, num: 2 }, { alt: -1, dir: -1, num: 2 },
      { alt: 0, dir: -1, num: 4 }, null, null,
      { alt: 0, dir: 1, num: 9 }, { alt: -1, dir: 1, num: 9 },
      { alt: 0, dir: -1, num: 9 }, { alt: -1, dir: -1, num: 9 }
    ])
  })

  test('fromProps', () => {
    expect(ivl.fromProps({ num: 1, alt: 0, dir: 1 })).toBe('1P')
    expect(ivl.fromProps({ num: 8, alt: -1, dir: -1 })).toBe('-8d')
    expect(ivl.fromProps({ num: 9, alt: -1, dir: -1 })).toBe('-9m')
    expect(ivl.fromProps({ num: 0 })).toBe(null)
    expect(ivl.fromProps({ num: -1 })).toBe(null)
    expect(ivl.fromProps({ num: 7 })).toBe('7M')
    expect(ivl.fromProps()).toBe(null)
  })

  test('num', () => {
    expect(map(ivl.num, '1P 2M m3 P-4 5 blah m11')).toEqual([1, 2, 3, 4, null, null, 11])
  })

  test('value', () => {
    expect(map(ivl.value, '1P 2M m3 P-4 5 blah m-11')).toEqual([1, 2, 3, -4, null, null, -11])
  })

  test('semitones', () => {
    expect(map(ivl.semitones, '1P 2M 3M 4P 5P 6M 7M')).toEqual([ 0, 2, 4, 5, 7, 9, 11 ])
    expect(map(ivl.semitones, '8P 9M 10M 11P 12P 13M 14M')).toEqual([ 12, 14, 16, 17, 19, 21, 23 ])
    expect(map(ivl.semitones, '8d 9m 10m 11d 12d 13m 14m')).toEqual([ 11, 13, 15, 16, 18, 20, 22 ])
    expect(map(ivl.semitones, '-8P -9M -10M -11P -12P -13M -14M')).toEqual([ -12, -14, -16, -17, -19, -21, -23 ])
  })

  test('get interval name from semitones', () => {
    expect(map(ivl.fromSemitones, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toEqual([ '1P', '2m', '2M', '3m', '3M', '4P', '5d', '5P', '6m', '6M', '7m', '7M' ])
    expect(map(ivl.fromSemitones, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])).toEqual(
      [ '8P', '9m', '9M', '10m', '10M', '11P', '12d', '12P', '13m', '13M', '14m', '14M' ]
    )
    expect(map(ivl.fromSemitones, [-0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11])).toEqual(
      [ '1P', '-2m', '-2M', '-3m', '-3M', '-4P', '-5d', '-5P', '-6m', '-6M', '-7m', '-7M' ]
    )
    expect(
      map(ivl.fromSemitones, [-12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23])
    ).toEqual(
      [ '-8P', '-9m', '-9M', '-10m', '-10M', '-11P', '-12d', '-12P', '-13m', '-13M', '-14m', '-14M' ]
    )
  })

  test('get interval class', () => {
    expect(map(ivl.ic, '1P 2M 3M 4P 5P 6M 7M 8P')).toEqual([ 0, 2, 4, 5, 5, 3, 1, 0 ])
    expect(map(ivl.ic, '1d 2m 3m 4d 5d 6m 7m 8d')).toEqual([ 1, 1, 3, 4, 6, 4, 2, 1 ])
    expect(map(ivl.ic, '8P 9M 10M 11P 12P 13M 14M 15P')).toEqual([ 0, 2, 4, 5, 5, 3, 1, 0 ])
    expect(map(ivl.ic, '-1P -2M -3M -4P -5P -6M -7M -8P')).toEqual([ 0, 2, 4, 5, 5, 3, 1, 0 ])
    // from semitones
    expect(map(ivl.ic, [0, 2, 4, 5, 7, 9, 11, 12])).toEqual([ 0, 2, 4, 5, 5, 3, 1, 0 ])
    expect(ivl.ic('blah')).toBe(null)
  })

  test('interval types', () => {
    expect(map(ivl.type, '1P 2M 3M 4P 5P 6M 7M')).toEqual([ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
    expect(map(ivl.type, '8d 9m 10m 11d 12d 13m 14m')).toEqual([ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
    expect(map(ivl.type, '-15A -16A -17A -18A -19A -20A -21A')).toEqual([ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
  })

  test('simplify intervals', () => {
    expect(map(ivl.simplify, '1P 2M 3M 4P 5P 6M 7M')).toEqual([ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    expect(map(ivl.simplify, '8P 9M 10M 11P 12P 13M 14M')).toEqual([ '8P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    expect(map(ivl.simplify, '1d 1P 1A 8d 8P 8A 15d 15P 15A')).toEqual([ '1d', '1P', '1A', '8d', '8P', '8A', '1d', '1P', '1A' ])
    expect(map(ivl.simplify, '-1P -2M -3M -4P -5P -6M -7M')).toEqual([ '-1P', '-2M', '-3M', '-4P', '-5P', '-6M', '-7M' ])
    expect(map(ivl.simplify, '-8P -9M -10M -11P -12P -13M -14M')).toEqual([ '-8P', '-2M', '-3M', '-4P', '-5P', '-6M', '-7M' ])
  })

  test('invert intervals', () => {
    expect(map(ivl.invert, '1P 2M 3M 4P 5P 6M 7M')).toEqual([ '1P', '7m', '6m', '5P', '4P', '3m', '2m' ])
    expect(map(ivl.invert, '1d 2m 3m 4d 5d 6m 7m')).toEqual([ '1A', '7M', '6M', '5A', '4A', '3M', '2M' ])
    expect(map(ivl.invert, '1A 2A 3A 4A 5A 6A 7A')).toEqual([ '1d', '7d', '6d', '5d', '4d', '3d', '2d' ])
    expect(map(ivl.invert, '-1P -2M -3M -4P -5P -6M -7M')).toEqual([ '-1P', '-7m', '-6m', '-5P', '-4P', '-3m', '-2m' ])
    expect(map(ivl.invert, '8P 9M 10M 11P 12P 13M 14M')).toEqual([ '8P', '14m', '13m', '12P', '11P', '10m', '9m' ])
  })
})
