/* global describe it */
var assert = require('assert')
var key = require('..')

describe('key.altNotes', function () {
  it('major', function () {
    assert.deepEqual(key.altNotes('C'), [])
    assert.deepEqual(key.altNotes('F major'), ['Bb'])
    assert.deepEqual(key.altNotes('A major'), ['F#', 'C#', 'G#'])
    assert.deepEqual(key.altNotes('Eb major'), ['Bb', 'Eb', 'Ab'])
  })
  it('invalid', function () {
    assert.deepEqual(key.altNotes('major'), null)
    assert.deepEqual(key.altNotes('C blah'), null)
  })
})
