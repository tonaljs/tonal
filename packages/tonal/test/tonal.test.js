/* global describe test expect */
var tonal = require('..')

describe('tonal', () => {
  test('exports', () => {
    expect(Object.keys(tonal).length).toBe(31)
    Object.keys(tonal).forEach(function (name) {
      expect(tonal[name]).not.toBe(undefined)
    })
  })
  test('functions', () => {
    expect(typeof tonal.scale).toBe('function')
    expect(typeof tonal.chord).toBe('function')
  })
  test('aliases', () => {
    expect(tonal.scale('C major')).toEqual(tonal.scale.notes('C major'))
    expect(tonal.chord('Cmaj7')).toEqual(tonal.chord.notes('Cmaj7'))
  })
})
