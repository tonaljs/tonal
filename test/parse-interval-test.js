var vows = require('vows')
var assert = require('assert')
var parse = require('../lib/parse-interval')
var names = require('../lib/interval-names')
var _ = require('lodash')

vows.describe('Intervals').addBatch({
  'simple intervals': function () {
    var simples = names().map(parse)
    assert.deepEqual(_.pluck(simples, 'quality'), ['d', 'P', 'A', 'd', 'm', 'M', 'A', 'd', 'm', 'M', 'A', 'd', 'P', 'A', 'd', 'P', 'A', 'd', 'm', 'M', 'A', 'd', 'm', 'M', 'A', 'd', 'P', 'A'])
    assert.deepEqual(_.pluck(simples, 'num'), [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8])
    assert.deepEqual(_.pluck(simples, 'oct'), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    assert.deepEqual(_.pluck(simples, 'dist'), [-1, 0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 4, 5, 6, 6, 7, 8, 7, 8, 9, 10, 9, 10, 11, 12, 11, 12, 13])
  },
  'simple descendent intervals': function () {
  },
  'compound intervals': function () {
  },
  'invalid intervals': function () {
    assert.throws(function () { parse('m1') }, /valid/)
  }
}).export(module)
