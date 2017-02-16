/* global describe test expect */
var scale = require('..')

describe('tonal-scale', () => {
  test('parse', () => {
    expect(scale.parse('cb3 major')).toEqual({ tonic: 'Cb3', type: 'major' })
    expect(scale.parse('melodic minor')).toEqual({ tonic: false, type: 'melodic minor' })
    expect(scale.parse()).toBe(null)
  })

  test('isKnowScale', () => {
    expect(scale.isKnowScale('major')).toBe(true)
    expect(scale.isKnowScale('Maj7')).toBe(false)
  })

  test('intervals', () => {
    expect(scale.intervals('C major')).toEqual([ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    expect(scale.intervals('major')).toEqual([ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    expect(scale.intervals('blah')).toEqual([])
  })

  test('notes', () => {
    expect(scale.notes('C major')).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    expect(scale.notes('C4 major')).toEqual(scale.notes('C major'))
    expect(scale.notes('Eb bebop')).toEqual([ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ])
    expect(scale.notes('d4 e5 g3 c6 d5')).toEqual(['D', 'E', 'G', 'C'])
    expect(scale.notes('Cmaj7')).toEqual([])
    expect(scale.notes('blah')).toEqual([])
  })

  test('get', () => {
    expect(scale.get('major', 'C')).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    expect(scale.get('major', 'C2')).toEqual([ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
    // alias
    expect(scale.get('ionian', 'C')).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    // intervals
    expect(scale.get('major', false)).toEqual([ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
    // partially applied
    expect(scale.get('major')('Db3')).toEqual([ 'Db3', 'Eb3', 'F3', 'Gb3', 'Ab3', 'Bb3', 'C4' ])
    // not found
    expect(scale.get('no-scale', 'D')).toEqual(null)
    expect(scale.get('major', 'blah')).toEqual([])
  })

  test('names', () => {
    expect(scale.names().length > 0).toBeTruthy()
    expect(scale.names(true).length > scale.names().length).toBeTruthy()
  })

  test('names with filter', () => {
    expect(scale.names(true, function (name, intervals) {
      return intervals.length === 9
    })).toEqual([ 'composite blues' ])
  })

  test('detect', () => {
    expect(scale.detect('f3 a c5 e2 d g2 b6')).toEqual([
      'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian',
      'A aeolian', 'B locrian'
    ])
  })
})
