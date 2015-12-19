/* global describe it */
var assert = require('assert')
var type = require('..').type

describe('chord.type', function () {
  it('major chord type', function () {
    assert.equal(type('C E G'), 'M')
    assert.equal(type('D F# A C#'.split(' ')), 'M')
  })
  it('minor chord type', function () {
    assert.equal(type('E G B'), 'm')
    assert.equal(type('E G B D'), 'm')
    assert.equal(type('E G B D#'), 'm')
  })
  it('augmented chord type', function () {
    assert.equal(type('C E G#'), 'aug')
    assert.equal(type('C E Ab'), null)
  })
  it('dominant chord type', function () {
    assert.equal(type('G B D F'), '7')
    assert.equal(type('A C# E G'), '7')
  })
  it('diminished chord type', function () {
    assert.equal(type('B D F'), 'dim')
    assert.equal(type('B D F A'), 'dim')
    assert.equal(type('B D F Ab'), 'dim')
  })
  it('sus4', function () {
    assert.equal(type('C F G'), 'sus4')
  })
  it('invalid chord types', function () {
    assert.equal(type(), null)
    assert.equal(type('m n y'), null)
    assert.equal(type('C D E'), null)
  })
})
