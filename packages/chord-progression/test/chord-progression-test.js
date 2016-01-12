/* global describe it */

var assert = require('assert')
var progression = require('..')

describe('chord-progression', function () {
  it('creates a chord progression from roman numerals chords and tonic', function () {
    assert.deepEqual(progression('C', 'I IIm7 V7'), ['C', 'Dm7', 'G7'])
  })

  it('skips invalid roman numerals', function () {
    assert.deepEqual(progression('C', 'Imaj7 2 IIIm7'), [ 'Cmaj7', null, 'Em7' ])
  })
})
