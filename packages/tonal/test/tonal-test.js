/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')

describe('tonal', function () {
  it('exports functions', function () {
    var names = Object.keys(tonal)
    assert.equal(names.length, 26)
    names.forEach(function (name) {
      assert(tonal[name], name)
    })
  })
})
