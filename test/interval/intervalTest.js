var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/interval')

vows.describe('interval/interval').addBatch({
  'from number': function () {
    assert.equal(interval(1), '1P')
    assert.equal(interval(9, null, 1), '9A')
    assert.equal(interval(-1, 0, 0), '-1P')
    assert.equal(interval(-10, 0, -1), '-3m')
  },
  'from string': function () {
    assert.equal(interval('5P'), '5P')
    assert.equal(interval('2A'), '2A')
    assert.equal(interval('1P', 0), '1P')
    assert.equal(interval('1P', 1), '8P')
    assert.equal(interval('1P', 2), '15P')
    assert.equal(interval('15P', 0), '1P')
    assert.equal(interval('15P', 1), '8P')
    assert.equal(interval('2A', 1), '9A')
    assert.equal(interval('2A', null, 0), '2M')
  },
  'invalid intervals': function () {
    assert.equal(interval(0), null)
    assert.equal(interval(), null)
  },
  'edge cases': function () {
    assert.equal(interval(-5, 0), '-5P')
  },
  'from number and octaves': function () {
    assert.equal(interval(1, 1), '8P')
    assert.equal(interval(5, 1), '12P')
    assert.equal(interval(9, 0, -1), '2m')
    assert.equal(interval(-1, 1, 0), '-8P')
    assert.equal(interval(-10, 2, -1), '-17m')
  },
  'from number and alterations': function () {
    assert.deepEqual([-2, -1, 0, 1, 2].map(function (alter) {
      return interval(5, 0, alter)
    }), ['5dd', '5d', '5P', '5A', '5AA'])
    assert.deepEqual([-3, -2, -1, 0, 1, 2].map(function (alter) {
      return interval(2, 0, alter)
    }), ['2dd', '2d', '2m', '2M', '2A', '2AA'])
  }
}).export(module)
