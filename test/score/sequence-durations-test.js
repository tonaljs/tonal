'use strict'
var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var parse = require('../../lib/score/sequence')

vows.describe('Parse durations').addBatch({
  'duration parsing': {
    'simple duration parsing': function () {
      var s = parse('a2/q c3/e c4/e. b/w f#-2/qt')
      assert.equal(s.length, 5)
      assert.deepEqual(_.pluck(s, 'value'), 'a2 c3 c4 b f#-2'.split(' '))
      assert.deepEqual(_.pluck(s, 'duration'), [0.25, 0.125, 0.1875, 1, 0.16666666666666666])
    },
    'duration in number': function () {
      var s = parse('a2/4 c#4/8. val/16t')
      assert.deepEqual(_.pluck(s, 'value'), ['a2', 'c#4', 'val'])
      assert.deepEqual(_.pluck(s, 'duration'), [0.25, 0.1875, 0.041666666666666664])
    },
    'added durations': function () {
      var s = parse('val/q.+8 val/4t+q')
      assert.deepEqual(_.pluck(s, 'value'), ['val', 'val'])
      assert.deepEqual(_.pluck(s, 'duration'), [0.5, 0.41666666666666667])
    },
    'multiple add duration': function () {
      var s = parse('val/1+2+4+4+4+4')
      assert.equal(s[0].duration, 2.5)
    },
    'wrong duration': function () {
      var s = parse('a2/a b2/b')
      assert.deepEqual(_.pluck(s, 'value'), 'a2/a b2/b'.split(' '))
      assert.deepEqual(_.pluck(s, 'duration'), [0.25, 0.25])
    }
  },
  'duration and extension': function () {
    var s = parse('val/4 _/4')
    assert.deepEqual(_.pluck(s, 'value'), ['val'])
    assert.deepEqual(_.pluck(s, 'duration'), [0.5])
  },
  'options': {
    'custom parser': function () {
      var parseDuration = function (value) {
        var match = /^([a-z]+)\{(\d+)\}$/.exec(value)
        return [match[1], +match[2]]
      }
      var s = parse('a{10} b{5}', { durationParser: parseDuration })
      assert.deepEqual(_.pluck(s, 'value'), ['a', 'b'])
      assert.deepEqual(_.pluck(s, 'duration'), [10, 5])
      assert.deepEqual(_.pluck(s, 'position'), [0, 10])
    }
  }
}).export(module)
