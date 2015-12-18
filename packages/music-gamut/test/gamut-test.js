/* global describe it */
var assert = require('assert')
var gamut = require('..')

describe('music-gamut', function () {
  it('create gamuts', function () {
    assert.deepEqual(gamut('c fx d3 blah 5'), [ 'C', 'F##', 'D3', null, '5P' ])
  })
})
