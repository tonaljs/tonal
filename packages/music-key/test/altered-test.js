/* global describe it */
var assert = require('assert')
var key = require('..')

describe('music-key/altered', function () {
  it('major', function () {
    assert.deepEqual(key.altered('C'), [])
    assert.deepEqual(key.altered('F major'), ['Bb'])
    assert.deepEqual(key.altered('A major'), ['F#', 'C#', 'G#'])
    assert.deepEqual(key.altered('Eb major'), ['Bb', 'Eb', 'Ab'])
  })
  it('invalid', function () {
    assert.deepEqual(key.altered('major'), null)
    assert.deepEqual(key.altered('C blah'), null)
  })
})
