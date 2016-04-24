/* global describe it */
var assert = require('assert')
var keys = require('..')

describe('music-key', function () {
  it.skip('by name', function () {
    assert.equal(key('c'), 'C major')
    assert.equal(key('c MAJOR'), 'C major')
  })
  it.skip('by signature', function () {
    assert.equal(key('#'), 'G major')
    assert.equal(key('###'), 'A major')
    assert.equal(key('bbb'), 'Eb major')
  })
  it.skip('by alterations', function () {
    assert.equal(key(1), 'G major')
    assert.equal(key(3), 'A major')
    assert.equal(key(-3), 'Eb major')
  })
  describe('modes', function () {
    it.skip('return a list of valid modes', function () {
      assert.deepEqual(key.modes(), [ 'major', 'minor', 'ionian', 'dorian',
      'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ])
    })
  })
})
