/* global describe it */
var assert = require('assert')
var helmholtz = require('../helmholtz/parse')
var scientific = require('../note/parse')

describe('music-notation/helmholtz/parse', function () {
  it('parses low and upper case', function () {
    assert.deepEqual(helmholtz('C#'), scientific('C#2'))
    assert.deepEqual(helmholtz('c#'), scientific('C#3'))
  })

  it('parses octave postfix', function () {
    assert.deepEqual(helmholtz("c'"), scientific('C4'))
    assert.deepEqual(helmholtz("c''"), scientific('C5'))
    assert.deepEqual(helmholtz("c'''"), scientific('C6'))
  })

  it('parses octave prefix', function () {
    assert.deepEqual(helmholtz(',C'), scientific('C1'))
    assert.deepEqual(helmholtz(',,C'), scientific('C0'))
    assert.deepEqual(helmholtz(',,,C'), scientific('C-1'))
  })

  it('returns null if invalid note', function () {
    assert.equal(helmholtz("C'"), null)
    assert.equal(helmholtz(',c'), null)
  })
})
