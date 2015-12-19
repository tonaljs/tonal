/* global describe it */
var assert = require('assert')
var binary = require('../lib/binary')

describe('set.binary', function () {
  it('get binary set', function () {
    assert.equal(binary('C D e f#').length, 12)
    assert.equal(binary('C D e f#'), '101010100000')
    assert.equal(binary('c d e f g a b'), '101011010101')
    assert.equal(binary('c d e f g a b c d e f'), '101011010101')
  })
  it('compare binary sets', function () {
    assert.equal(binary('c d eb f g a bb'), binary('d e f g a b c'))
  })
  it('strange notes binary set', function () {
    assert.equal(binary('C2 D1'), binary('c2 d2'))
  })
})
