/* global describe test expect */
var t = require('../')
var tr = t.transpose

function map (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

describe('tonal-scale', () => {
  test('order of params is not relevant', () => {
    expect(tr('c#2', 'm3')).toEqual(tr('m3', 'c#2'))
  })
  test('notes by intervals', () => {
    expect(map(tr('3M'), 'c2 d3 f4 g5'))
    .toEqual([ 'E2', 'F#3', 'A4', 'B5' ])
  })
  test('pitch classes by intervals', () => {
    expect(map(tr('Bb'), 'P1 M3 P5 M7'))
    .toEqual([ 'Bb', 'D', 'F', 'A' ])
  })
  test('transpose nulls', () => {
    expect(tr('M3', 'blah')).toBe(null)
    expect(tr('C2', 'blah')).toBe(null)
    expect(tr(null, null)).toBe(null)
  })
  test('notes by descending intervals', () => {
    expect(map(tr('-2M'), 'c2 d3 f4 g5'))
    .toEqual([ 'Bb1', 'C3', 'Eb4', 'F5' ])
  })
  test('intervals by intervals', () => {
    expect(map(tr('3M'), '1P 2M 3M 4P 5P'))
    .toEqual([ '3M', '4A', '5A', '6M', '7M' ])
  })
  test('descending intervals', () => {
    expect(map(tr('-2M'), '1P 2M 3M 4P 5P'))
    .toEqual([ '-2M', '1P', '2M', '3m', '4P' ])
  })
  test('all desending intervals', () => {
    expect(map(tr('-2M'), '-5P -4P -3M -2M 1P'))
    .toEqual(['-6M', '-5P', '-4A', '-3M', '-2M'])
  })
  test('returns array notation if both params are in array notation', () => {
    expect(tr(['tnlp', [1, 0], 1], ['tnlp', [1, 0]]))
    .toEqual([ 'tnlp', [2, 0] ])
  })
  test('transpose edge cases', () => {
    var trC = function (i) { return i.split(' ').map(tr('C2')) }
    expect(trC('1d 1P 1A')).toEqual(['Cb2', 'C2', 'C#2'])
    expect(trC('-1d -1P -1A')).toEqual(['C#2', 'C2', 'Cb2'])
    expect(trC('2d 2m 2M 2A')).toEqual([ 'Dbb2', 'Db2', 'D2', 'D#2' ])
    expect(trC('-2d -2m -2M -2A')).toEqual([ 'B#1', 'B1', 'Bb1', 'Bbb1' ])
    expect(trC('4dd 4d 4P 4A 4AA')).toEqual([ 'Fbb2', 'Fb2', 'F2', 'F#2', 'F##2' ])
    expect(trC('5P -5P 5A -5A')).toEqual(['G2', 'F1', 'G#2', 'Fb1'])
    expect(trC('6M -6M 6m -6m')).toEqual(['A2', 'Eb1', 'Ab2', 'E1'])
  })

  test('transpose fifths', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(t.trFifths('C')))
    .toEqual([ 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#' ])
  })
})
