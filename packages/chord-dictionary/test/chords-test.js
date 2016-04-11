/* global describe it */
var assert = require('assert')
var chords = require('..')

describe('chord-dictionary', function () {
  it('get chord intervals as array of strings', function () {
    assert.deepEqual(chords['Maj7'], [ '1', '3', '5', '7' ])
    assert.deepEqual(chords['7#9#11'], [ '1', '3', '5', '7b', '9#', '11#' ])
  })
  it('get chord name for aliases', function () {
    assert.equal(chords['maj7'], 'Maj7')
  })
  it('has chords', function () {
    assert(Object.keys(chords).length > 200)
  })
  it('every name has value', function () {
    Object.keys(chords).forEach(function (name) {
      assert(chords[name])
    })
  })
})
