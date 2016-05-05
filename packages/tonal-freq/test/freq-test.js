/* global describe it */
'use strict'

var assert = require('assert')
var freq = require('../')

describe('tonal-freq', function () {
  describe('toFreq', function () {
    it('convert note names to 440Hz', function () {
      assert.deepEqual(freq.toFreq('A4'), 440)
    })
  })
})
