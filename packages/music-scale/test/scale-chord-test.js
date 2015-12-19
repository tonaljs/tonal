/* global describe it */
var assert = require('assert')
var chord = require('../lib/chord')

describe('music-scale/scale-chord', function () {
  it('chord of major', function () {
    assert.equal(chord('c d e f g a b'), 'CM')
  })
})
