/* global describe test expect */
var dist = require('..')

var map = function (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

describe('tonal-distance', () => {
  test('get distance between notes', () => {
    var fromC3 = map(dist.interval('C3'))
    expect(fromC3('C3 e3 e4 c2 e2')).toEqual([ '1P', '3M', '10M', '-8P', '-6m' ])
  })

  test('distances between pitch classes are always ascending', () => {
    expect(dist.interval('C', 'D')).toEqual('2M')
    var fromC = map(dist.interval('C'))
    expect(fromC('c d e f g a b')).toEqual([ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    var fromG = map(dist.interval('G'))
    expect(fromG('c d e f g a b')).toEqual([ '4P', '5P', '6M', '7m', '1P', '2M', '3M' ])
  })
  test('get difference between intervals', () => {
    var subsM2 = map(dist.interval('M2'))
    expect(subsM2('P1 M2 M3 P4 P5 M6 M7')).toEqual([ '-2M', '1P', '2M', '3m', '4P', '5P', '6M' ])
  })
  test('pitch types can not be mixed', () => {
    expect(dist.interval('C', 'C2')).toBe(null)
    expect(dist.interval('C2', 'C')).toBe(null)
  })
  test('when both pitches are in arra format, return array format', () => {
    expect(dist.interval(['tnlp', [0, 0]], ['tnlp', [1, 0]])).toEqual([ 'tnlp', [1, 0], 1 ])
  })
  test('when one pitch in array format, return string', () => {
    expect(dist.interval(['tnlp', [0]], 'D')).toEqual('2M')
  })

  test('semitones', () => {
    expect(dist.semitones('C3', 'G#3')).toBe(8)
    expect(dist.semitones('C4', 'A3')).toBe(-3)
    expect(dist.semitones('blah', 'C3')).toBe(null)
    expect(dist.semitones('C', 'D')).toBe(2)
  })
})
