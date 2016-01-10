/* global describe it */
var assert = require('assert')
var gamut = require('..')

describe('music-gamut', function () {
  it('create gamuts', function () {
    assert.deepEqual(gamut('c fx d3 blah 5'), [ 'C', 'F##', 'D3', null, '5P' ])
  })

  it('operate gamuts', function () {
    assert.deepEqual(gamut(function (gamut) {
      return gamut.map(function (arr) { return [arr[0] + 1] })
    }, 'c d e f g'), ['G', 'A', 'B', 'C', 'D'])
  })
})
