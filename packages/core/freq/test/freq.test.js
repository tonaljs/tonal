/* global describe it expect */
var freq = require('..')

describe('tonal-freq', () => {
  it('note name to frequency', () => {
    expect(freq.toFreq('A4')).toBe(440)
    expect(freq.toFreq('C4')).toBe(261.63)
    expect(freq.toFreq('blah')).toBe(null)
  })

  it('midi number to frequency', () => {
    expect(freq.toFreq(69)).toBe(freq.toFreq('A4'))
    expect(freq.toFreq(60)).toBe(freq.toFreq('C4'))
  })

  it('freq: eqTempFreqToMidi', () => {
    expect(freq.eqTempFreqToMidi(440, 2, 440)).toBe(69)
    expect(freq.eqTempFreqToMidi(444, 2, 440)).toBe(68.84)
    expect(freq.eqTempFreqToMidi(444, 4, 440)).toBe(68.8433)
    expect(freq.eqTempFreqToMidi(440, 4, 255)).toBe(59.5559)
    expect(freq.eqTempFreqToMidi(440, 0, 255)).toBe(60)
  })

  it('freq: toMidi', () => {
    expect(freq.toMidi(220)).toBe(57)
    expect(freq.toMidi(261.62)).toBe(60)
    expect(freq.toMidi(261)).toBe(59.96)
  })

  it('note name from frequency', () => {
    expect(freq.note(261)).toBe('C4')
    expect(freq.note(275)).toBe('Db4')
    expect(freq.note(275, true)).toBe('C#4')
  })

  it('get distance in cents', () => {
    expect(freq.cents(261, 'C4')).toBe(4)
    expect(freq.cents('C4', 261)).toBe(-4)
  })

  it('freq: eqTempFreq', () => {
    expect(freq.eqTempFreq(444, 4, 'C6')).toBe(1056.0159)
    expect(freq.eqTempFreq(444, 3, 'C6')).toBe(1056.016)
    expect('c4 d4 e4 f4 g4 a4 b4'.split(' ').map(freq.eqTempFreq(440, 1))).toEqual([ 261.6, 293.7, 329.6, 349.2, 392, 440, 493.9 ])
    expect('c4 d4 e4 f4 g4 a4 b4'.split(' ').map(freq.eqTempFreq(440, 2))).toEqual([ 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88 ])
  })
})
