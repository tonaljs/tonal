/* global describe test expect */
var dft = require('..')

describe('tonal-pcset-dft', function () {
  test('pcset', function () {
    expect(dft.pcset('C4 E4 G#4')).toEqual([ '0', '4', '8' ])
  })

  test('components', function () {
    expect(dft.dft('C4 E4 G#4')).toEqual([ [ 3, 0 ], [ 0, 0 ], [ 0, 0 ], [ 3, 0 ], [ 0, 0 ], [ 0, 0 ], [ 3, 0 ] ])
  })

  test('spectra', function () {
    expect(dft.spectra('C4 E4 G#4')).toEqual([ 3, 0, 0, 3, 0, 0, 3 ])
  })

  test('distance', function () {
    expect(dft.distance('C E G', 'C Eb G')).toBe(1.5307337294603596)
  })
})
