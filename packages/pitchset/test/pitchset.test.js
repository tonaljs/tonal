/* global describe test expect */
var pitchset = require('..')

describe('tonal-pitchset', function () {
  test('notes', function () {
    expect(pitchset.notes('C4 c3 C5 C4 c4')).toEqual(['C3', 'C4', 'C5'])
  })
})
