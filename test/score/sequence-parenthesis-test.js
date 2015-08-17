'use strict'
var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var parse = require('../../lib/score/sequence')

vows.describe('Measures parenthesis').addBatch({
  'simple division': function () {
    var s = parse('a (b c)')
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b', 'c'])
    assert.deepEqual(_.pluck(s, 'duration'), [0.5, 0.25, 0.25])
    assert.deepEqual(_.pluck(s, 'position'), [0, 0.5, 0.75])
  },
  'triplets': function () {
    var s = parse('a a (b c d) a')
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'a', 'b', 'c', 'd', 'a'])
    assert.deepEqual(_.pluck(s, 'duration'), [0.25,
      0.25,
      0.08333333333333333,
      0.08333333333333333,
      0.08333333333333333,
      0.25])
    assert.deepEqual(_.pluck(s, 'position'), [0,
      0.25,
      0.5,
      0.5833333333333334,
      0.6666666666666666,
      0.75])
  },
  'dotted quarter': function () {
    var s = parse('(a _ _ b) (c d)')
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b', 'c', 'd'])
    assert.deepEqual(_.pluck(s, 'duration'), [0.375, 0.125, 0.25, 0.25])
    assert.deepEqual(_.pluck(s, 'position'), [0, 0.375, 0.5, 0.75])
  },
  'extend measure': function () {
    var s = parse('a | _ (b c)')
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b', 'c'])
    assert.deepEqual(_.pluck(s, 'duration'), [1.5, 0.25, 0.25])
    assert.deepEqual(_.pluck(s, 'position'), [0, 1.5, 1.75])
  }
}).export(module)
