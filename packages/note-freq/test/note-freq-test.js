/* global describe it */
var assert = require('assert')
var freq = require('..')

describe('note-freq', function () {
  it('get frequency from a note', function () {
    assert.equal(freq(440, 'A4'), 440)
    assert.equal(freq(444, 'A2'), 111)
    assert.equal(freq(440, 'c2'), 65.40639132514966)
  })
  it('can be partially applied', function () {
    var f = freq(440)
    assert.equal(f('A3'), 220)
  })
  it('works with midi numbers too', function () {
    assert.equal(freq(440, 69), 440)
    assert.equal(freq(444, 57), 222)
  })
})
