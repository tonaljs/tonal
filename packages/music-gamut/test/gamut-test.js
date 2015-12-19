/* global describe it */
var assert = require('assert')
var gamut = require('..')

describe('music-gamut', function () {
  it('create gamuts', function () {
    assert.deepEqual(gamut('c fx d3 blah 5'), [ 'C', 'F##', 'D3', null, '5P' ])
  })

  it('operate gamuts', function () {
    assert.deepEqual(gamut('c d e f g', function (gamut) {
      return gamut.map(function (arr) { return [arr[0] + 1] })
    }), ['G', 'A', 'B', 'C', 'D'])
  })

  it('get harmonics', function () {
    assert.deepEqual(gamut('c d e f g a b c', false),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M', '1P'])
  })
})
