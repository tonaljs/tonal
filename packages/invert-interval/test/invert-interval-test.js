/* global describe it */
var assert = require('assert')
var invert = require('..')

describe('invert-interval', function () {
  it.skip('inverts an interval', function () {
    assert.equal(invert('2M'), '7m')
  })
})
