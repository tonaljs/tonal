/* global describe it */
var assert = require('assert')
var names = require('../lib/names')

describe('scale.names', function () {
  it('all names', function () {
    assert.equal(names().length, 89)
  })
})
