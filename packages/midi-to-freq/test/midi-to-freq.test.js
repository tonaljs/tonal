/* global describe it */
var assert = require('assert')
var freq = require('..')

describe('midi-to-freq', function () {
  it('custom tuning', function () {
    assert.equal(freq(444, 57), 222)
    assert.equal(freq(448, 57), 224)
  })
  it('partially applied', function () {
    var f = freq(500)
    assert.equal(f(57), 250)
  })
  it('440 is the default tuning', function () {
    assert.equal(freq(null, 57), 220)
    assert.equal(freq(null, 60), 261.6255653005986)
  })
  it('invalid midi', function () {
    assert.equal(freq(440, null), null)
    assert.equal(freq(440, 'blah'), null)
  })
})
