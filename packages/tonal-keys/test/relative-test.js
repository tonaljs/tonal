/* global describe it */
var assert = require('assert')
var key = require('..')

describe('music-key/relative', function () {
  it('relatives', function () {
    assert.deepEqual(key.relative('minor', 'C major').name, 'A minor')
    assert.deepEqual(key.relative('major', 'C minor').name, 'Eb major')
    assert.deepEqual(key.relative('dorian', 'C minor').name, 'F dorian')
  })

  it.skip('can be partially applied', function () {
    assert.deepEqual(key.relative('minor')('C major').name, 'A minor')
  })
})
