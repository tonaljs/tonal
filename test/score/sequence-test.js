'use strict'
var vows = require('vows')
var assert = require('assert')

var parse = require('../../lib/score/sequence')

vows.describe('Melody parser').addBatch({
  'expect a string': function () {
    assert.throws(function () { parse() }, Error)
    assert.throws(function () { parse({}) }, Error)
  },
  'parse parsed': function () {
    // var s1 = parse('a b')
    // var s2 = parse(s1)
    // assert.deepEqual(s1, s2)
    // assert(s1 !== s2, 'Are equal but not same')
  }
}).export(module)
