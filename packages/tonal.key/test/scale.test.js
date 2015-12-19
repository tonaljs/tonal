/* global describe it */
var assert = require('assert')
var key = require('..')

describe('key.scale', function () {
  it('major', function () {
    assert.deepEqual(key.scale('Bb major'), ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'])
    assert.deepEqual(key.scale('Bb ionian'), ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'])
    assert.deepEqual(key.scale('Bb lydian'), ['Bb', 'C', 'D', 'E', 'F', 'G', 'A'])
    assert.deepEqual(key.scale('Bb mixolydian'), ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'Ab'])
  })
  it('minor', function () {
    assert.deepEqual(key.scale('D minor'), ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'])
    assert.deepEqual(key.scale('D dorian'), ['D', 'E', 'F', 'G', 'A', 'B', 'C'])
    assert.deepEqual(key.scale('D phrygian'), ['D', 'Eb', 'F', 'G', 'A', 'Bb', 'C'])
    assert.deepEqual(key.scale('D aeolian'), ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'])
    assert.deepEqual(key.scale('D locrian'), ['D', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C'])
  })
  it('no tonic', function () {
    assert.deepEqual(key.scale('major'), ['1P', '2M', '3M', '4', '5', '6M', '7M'])
    assert.deepEqual(key.scale('locrian'), ['1P', '2m', '3m', '4', '5b', '6m', '7m'])
  })
  it('invalid', function () {
    assert.deepEqual(key.scale('blah'), [])
  })
})
