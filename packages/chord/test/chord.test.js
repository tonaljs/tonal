/* global describe it expect */
var chord = require('..')
var DATA = require('../chords.json')

describe('tonal-chord', function () {
  it('detect', function () {
    expect(chord.detect('c e g b')).toEqual([ 'CMaj7' ])
    expect(chord.detect('e c a g')).toEqual([ 'CM6', 'Am7' ])
    expect(chord.detect('g d f# b')).toEqual([ 'GMaj7' ])
    expect(chord.detect('f a d g b')).toEqual([ 'Dm6', 'G9' ])
    expect(chord.detect('f bb g d# a')).toEqual([ 'Gm9#5' ])
  })

  it('chord data integrity', function () {
    chord.names(true).forEach(function (name) {
      if (!Array.isArray(DATA[name])) return
      var data = chord.get(name, false)
      var filtered = data.filter(function (x) { return x })
      expect(data.length).toBe(filtered.length)
    })
  })

  it('parse', function () {
    expect(chord.parse('Cmaj7')).toEqual({ type: 'maj7', tonic: 'C' })
    expect(chord.parse('C7')).toEqual({ type: '7', tonic: 'C' })
    expect(chord.parse('maj7')).toEqual({ type: 'maj7', tonic: false })
    expect(chord.parse('C#4 m7b5')).toEqual({ type: 'm7b5', tonic: 'C#4' })
    expect(chord.parse('C#4m7b5')).toEqual({ type: 'm7b5', tonic: 'C#4' })
    // TODO: fix this
    expect(chord.parse('C7b5')).toEqual({ type: 'b5', tonic: 'C7' })
  })

  it('get', function () {
    expect(chord.get('maj7#5', 'D')).toEqual([ 'D', 'F#', 'A#', 'C#' ])
  })

  it('notes', function () {
    expect(chord.notes('Cmaj7')).toEqual([ 'C', 'E', 'G', 'B' ])
    expect(chord.notes('C4 maj7')).toEqual([ 'C4', 'E4', 'G4', 'B4' ])
    expect(chord.notes('C7')).toEqual([ 'C', 'E', 'G', 'Bb' ])
    expect(chord.notes('C64')).toEqual(['G', 'C', 'E'])
    expect(chord.notes('Cmaj7#5')).toEqual([ 'C', 'E', 'G#', 'B' ])
    expect(chord.notes('e4 c5 g2')).toEqual(['E4', 'C5', 'G2'])
  })

  it('position', function () {
    expect(chord.position('g2 c3 e4 b')).toEqual(2)
    expect(chord.position('b e c g')).toEqual(3)
  })

  it('inversion', function () {
    expect(chord.inversion(1, 'C4 maj7')).toEqual([ 'E', 'G', 'B', 'C' ])
    expect(chord.inversion(0, 'e g c')).toEqual([ 'C', 'E', 'G' ])
    expect(chord.inversion(1, 'e g c')).toEqual([ 'E', 'G', 'C' ])
    expect(chord.inversion(2, 'e g c')).toEqual([ 'G', 'C', 'E' ])
    expect(chord.inversion(0)('b g e d c')).toEqual([ 'C', 'E', 'G', 'B', 'D' ])
    expect(chord.inversion(3, 'CMaj7#5')).toEqual([ 'B', 'C', 'E', 'G#' ])
  })

  it('names', function () {
    it(chord.names().length > 0)
    it(chord.names(true).length > chord.names().length)
  })
})
