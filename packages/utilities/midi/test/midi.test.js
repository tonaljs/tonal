/* global describe test expect */
var midi = require('..')
var map = function (fn, s) {
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

describe('tonal-midi', () => {
  test('toMidi - map note names to note numbers', () => {
    expect(map(midi.toMidi, 'C4 D4 E4 F4 G4 A4 B4 C5')).toEqual([ 60, 62, 64, 65, 67, 69, 71, 72 ])
    expect(map(midi.toMidi, 'C4 B#3 Dbb4')).toEqual([60, 60, 60])
  })
  test('toMidi - pitch classes do not have midi', () => {
    expect(map(midi.toMidi, 'C D E F G A B')).toEqual([ null, null, null, null, null, null, null ])
  })
  test('toMidi - midi numbers are bypassed', () => {
    expect(midi.toMidi(72)).toBe(72)
    expect(midi.toMidi('60') === 60).toBeTruthy()
  })
  test('toMidi - invalid values', () => {
    expect(midi.toMidi(null)).toBe(null)
    expect(midi.toMidi(-1)).toBe(null)
    expect(midi.toMidi(128)).toBe(null)
  })
  test('toMidi - accepts pitch in array notation', () => {
    expect(midi.toMidi([0, 4])).toBe(60)
    expect(midi.toMidi([3, 3])).toBe(69)
    // pitch classes doesn't have midi
    expect(midi.toMidi([5])).toBe(null)
  })
  test('note - get names from midi numbers', () => {
    expect(map(midi.note, [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72])).toEqual(
      [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5' ]
    )
  })
  test('note with type', () => {
    expect(midi.note(61, false)).toEqual('Db4')
    expect(midi.note(false)(61)).toEqual('Db4')
    expect(midi.note(61, true)).toEqual('C#4')
    expect(midi.note(true)(61)).toEqual('C#4')
  })
  test('note - partially applied with true', () => {
    expect(map(midi.note(true), [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72])).toEqual(
      [ 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ]
    )
  })
})
