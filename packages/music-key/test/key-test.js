/* global describe it */
var assert = require('assert')
var key = require('..')

describe('music-key', function () {
  it('by name', function () {
    assert.equal(key('c'), 'C major')
    assert.equal(key('c MAJOR'), 'C major')
  })
  it('by signature', function () {
    assert.equal(key('#'), 'G major')
    assert.equal(key('###'), 'A major')
    assert.equal(key('bbb'), 'Eb major')
  })
  it('by alterations', function () {
    assert.equal(key(1), 'G major')
    assert.equal(key(3), 'A major')
    assert.equal(key(-3), 'Eb major')
  })
})
