/* global describe test expect */
var tertian = require('..')
var tonal = require('../../tonal')

describe('tonal-scale', function () {
  test('tertian: intervals', () => {
    expect(tertian.intervals('mm')).toEqual([ '1P', '3m', '5d' ])
    expect(tertian.intervals('Mm')).toEqual([ '1P', '3M', '5P' ])
    expect(tertian.intervals('Mmm')).toEqual([ '1P', '3M', '5P', '7m' ])
  })

  test('tertian: permutations', () => {
    expect(tertian.allFor('mmMM'))
    .toEqual([ 'MMmm', 'MmMm', 'MmmM', 'mMMm', 'mMmM', 'mmMM' ])

    expect(tertian.allFor('mmMM').map(tertian.intervals)
    .map((i) => tonal.harmonize(i, 'C').join(' ')))
    .toEqual([
      'C E G# B D', 'C E G B D', 'C E G Bb D',
      'C Eb G B D', 'C Eb G Bb D', 'C Eb Gb Bb D'
    ])
  })
})
