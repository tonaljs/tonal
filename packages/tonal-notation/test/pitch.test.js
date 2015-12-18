/* global describe it */
var assert = require('assert')
var pitch = require('..').pitch

describe('pitch.pitch', function () {
  it('notes', function () {
    assert.equal(pitch('c2'), 'C2')
  })
  it('intervals', function () {
    assert.equal(pitch('2'), '2M')
  })
  it('invalid', function () {
    assert.equal(pitch('blah'), null)
    assert.equal(pitch(null), null)
    assert.equal(pitch(), null)
  })
})
