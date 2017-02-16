/* global describe test expect */
var sonority = require('..')

describe('tonal-sonority', function () {
  test('density', function () {
    expect(sonority.density('c e g b')).toEqual([ 2, 2, 1, 0, 1, 0 ])
    expect(sonority.density('c d gb')).toEqual([ 0, 1, 0, 1, 0, 1 ])
  })
})
