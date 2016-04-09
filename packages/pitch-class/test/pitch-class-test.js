/* global describe it */
var assert = require('assert')
var pc = require('..')

describe('pitch-class', function () {
  it('get pitch class from notes', function () {
    assert.equal(pc('fx3'), 'F##')
    assert.equal(pc('c'), 'C')
    assert.equal(pc('bb'), 'Bb')
  })
  it('get pitch class from midi number', function () {
    assert.equal(pc(69), 'A')
  })
})
