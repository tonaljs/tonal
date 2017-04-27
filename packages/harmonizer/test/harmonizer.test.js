/* global describe test expect */
var _ = require('../')

describe('tonal-harmonizer', () => {
  test('harmonics', () => {
    expect(_.harmonics('C E G')).toEqual([ '1P', '3M', '5P' ])
    expect(_.harmonics('C2 E3 G4')).toEqual([ '1P', '10M', '19P' ])
    expect(_.harmonics('x y z')).toEqual([])
  })

  test('distances', () => {
    expect(_.intervallic('c e g')).toEqual([ '3M', '3m' ])
    expect(_.intervallic('e g c')).toEqual([ '3m', '4P' ])
    expect(_.intervallic('C2 g4 c4')).toEqual([ '19P', '-5P' ])
  })

  test('harmonize', () => {
    expect(_.harmonize('1P 3M 5P', 'A4')).toEqual([ 'A4', 'C#5', 'E5' ])
    expect(_.harmonize('C E G', 'M3')).toEqual([ 'E', 'G#', 'B' ])

    expect(_.harmonize('C blah D', '7m')).toEqual([ 'Bb', 'C' ])
    expect(_.harmonize(null, '7m')).toEqual([])
    expect(_.harmonize('c d e', null)).toEqual([ 'C', 'D', 'E' ])

    var maj7 = _.harmonize('1P 3M 5P 7M')
    expect(maj7('Bb')).toEqual([ 'Bb', 'D', 'F', 'A' ])

    var diminished = _.harmonize('P1 m3 5d', 'C')
    expect(diminished).toEqual(['C', 'Eb', 'Gb'])
  })
})
