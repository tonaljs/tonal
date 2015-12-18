/* global describe it */
var assert = require('assert')
var chord = require('..').chord

describe('music-gamut/chord', function () {
  it('basic', function () {
    assert.deepEqual(chord('C2 E2 G2', 'A4'), ['A4', 'C#5', 'E5'])
  })
})
