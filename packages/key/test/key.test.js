/* global describe test expect */

var key = require('..')

describe('tonal-key', () => {
  test('mode', () => {
    expect(key.mode('mixophrygian')).toBe(null)
    expect(key.mode('blah')).toBe(null)
    expect(key.mode(null)).toBe(null)
    key.modes(true).forEach(function (m) {
      expect(key.mode(m)).toBe(m)
    })
  })

  test('tonic', () => {
    expect(key.tonic('c4 mixolydian')).toBe('C')
    expect(key.tonic('mixolydian')).toBe(null)
  })

  test('props', () => {
    expect(key.props('Eb mixolydian')).toEqual({ mode: 'mixolydian', tonic: 'Eb' })
    expect(key.props('lydian')).toEqual({ mode: 'lydian', tonic: false })
    expect(key.props('F#')).toEqual({ mode: 'major', tonic: 'F#' })
    expect(key.props('blah')).toEqual(null)
    expect(key.props('Eb blah')).toEqual(null)
  })

  test('scale', () => {
    expect(key.scale('C major')).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    expect(key.scale('C dorian')).toEqual([ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ])
    expect(key.scale('E mixolydian')).toEqual([ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ])
  })

  test('modes', () => {
    expect(key.modes(false)).toEqual(
      [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ]
    )
    expect(key.modes(true)).toEqual(
      [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
      'major', 'minor' ]
    )
  })

  test('from alter', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(key.fromAlter)).toEqual([ 'C major', 'G major', 'D major', 'A major', 'E major',
    'B major', 'F# major', 'C# major' ])
    expect([-0, -1, -2, -3, -4, -5, -6, -7, -8].map(key.fromAlter)).toEqual([ 'C major', 'F major', 'Bb major', 'Eb major', 'Ab major',
    'Db major', 'Gb major', 'Cb major', 'Fb major' ])
  })

  test('from accidentals', () => {
    expect(key.fromAcc('###')).toBe('A major')
    expect(key.fromAcc('bbb')).toBe('Eb major')
  })

  test('relative', () => {
    expect(key.relative('minor', 'Eb major')).toBe('C minor')
    expect(key.relative('dorian', 'Bb mixolydian')).toBe('F dorian')
    expect(key.relative('blah', 'C major')).toBe(null)

    var minor = key.relative('minor')
    expect(minor('C')).toBe('A minor')
  })

  test('alteration', () => {
    expect(key.alteration('A major')).toBe(3)
    var Amaj = 'A B C# D E F# G#'.split(' ')
    var modes = key.modes(false)
    Amaj.forEach(function (tonic, i) {
      expect(key.alteration(tonic + ' ' + modes[i])).toBe(3)
    })

    expect(key.alteration('Bb major')).toBe(-2)
  })

  test('signature', () => {
    expect(key.signature('E dorian')).toBe('##')
    expect(key.signature('Eb major')).toBe('bbb')
  })

  test('alteredNotes', () => {
    expect(key.alteredNotes('Eb major')).toEqual([ 'Bb', 'Eb', 'Ab' ])
    expect(key.alteredNotes('A major')).toEqual([ 'F#', 'C#', 'G#' ])
  })
})
