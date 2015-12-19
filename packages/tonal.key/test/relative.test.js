/* global describe it */
var assert = require('assert')
var key = require('..')

describe('key.relative', function () {
  it('relatives', function () {
    assert.deepEqual(key.relative('minor', 'C major'), 'A minor')
    assert.deepEqual(key.relative('major', 'C minor'), 'Eb major')
    assert.deepEqual(key.relative('dorian', 'C minor'), 'F dorian')
  })
})
