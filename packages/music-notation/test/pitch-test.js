/* global describe it */
var assert = require('assert')
var pitch = require('../pitch')

describe('music-notation/pitch/pitch', function () {
  it('return normalized notes', function () {
    assert.equal(pitch('c2'), 'C2')
    assert.equal(pitch('fx3'), 'F##3')
    assert.equal(pitch([8, -2, null]), 'G#2')
  })

  it('returns normalized intervals', function () {
    assert.equal(pitch('2'), '2M')
    assert.equal(pitch('-6'), '-6M')
    assert.equal(pitch([-3, 2]), '3m')
  })

  it('returns normalized pitch classes', function () {
    assert.equal(pitch('bb'), 'Bb')
    assert.equal(pitch([-3]), 'Eb')
  })

  it('decorates a function', function () {
    var octUp = pitch(function (p) { return [ p[0], p[1] + 1, p[2] ] })
    assert.equal(octUp('c#3'), 'C#4')
  })

  it('return null if invalid sources', function () {
    assert.equal(pitch('blah'), null)
    assert.equal(pitch(null), null)
    assert.equal(pitch(), null)
  })
})
