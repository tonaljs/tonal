/* global describe it */
var assert = require('assert')
var chord = require('..')

describe('chord.chord', function () {
  it('get by type and tonic', function () {
    assert.deepEqual(chord('Maj7', 'Eb'), ['Eb', 'G', 'Bb', 'D'])
    assert.deepEqual(chord('Maj7', 'Eb2'), ['Eb2', 'G2', 'Bb2', 'D3'])
  })
  it('get by complete name', function () {
    assert.deepEqual(chord('EbMaj7'), ['Eb', 'G', 'Bb', 'D'])
  })
  it('partial', function () {
    assert.deepEqual(chord('Maj7')('Eb'), ['Eb', 'G', 'Bb', 'D'])
  })
  it('intervals', function () {
    assert.deepEqual(chord('Maj7', false), ['1P', '3M', '5P', '7M'])
    assert.deepEqual(chord('Maj7')(false), ['1P', '3M', '5P', '7M'])
  })
  it('invalid name', function () {
    assert.deepEqual(chord('blah', 'C3'), [])
  })
})
