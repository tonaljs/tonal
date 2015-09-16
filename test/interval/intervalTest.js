var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/interval')

vows.describe('interval/interval').addBatch({
  'from number': function () {
    assert.equal(interval(1), '1P')
    // TODO: assert.equal(interval(2, 'm'), '2m')
    assert.equal(interval(9, 1, null), '9A')
    assert.equal(interval(-1, 0, 0), '-1P')
    assert.equal(interval(-10, -1, 0), '-3m')
  },
  'from string': function () {
    assert.equal(interval('5P'), '5P')
    assert.equal(interval('2A'), '2A')
    assert.equal(interval('1P', null, 0), '1P')
    assert.equal(interval('1P', null, 1), '8P')
    assert.equal(interval('1P', null, 2), '15P')
    assert.equal(interval('15P', null, 0), '1P')
    assert.equal(interval('15P', null, 1), '8P')
    assert.equal(interval('2A', null, 1), '9A')
    assert.equal(interval('2A', 0, null), '2M')
  },
  'invalid intervals': function () {
    assert.equal(interval(0), null)
    assert.equal(interval(), null)
  },
  'edge cases': function () {
    assert.equal(interval(-5, null, 0), '-5P')
    assert.equal(interval(1, null, -1), '-8P')
  },
  'from number and octaves': function () {
    assert.equal(interval(1, null, 1), '8P')
    assert.equal(interval(5, null, 1), '12P')
    assert.equal(interval(9, -1, 0), '2m')
    assert.equal(interval(-1, 0, 1), '-8P')
    assert.equal(interval(-10, -1, 2), '-17m')
  },
  'from number and alterations': function () {
    assert.deepEqual([-2, -1, 0, 1, 2].map(function (alter) {
      return interval(5, alter, 0)
    }), ['5dd', '5d', '5P', '5A', '5AA'])
    assert.deepEqual([-3, -2, -1, 0, 1, 2].map(function (alter) {
      return interval(2, alter, 0)
    }), ['2dd', '2d', '2m', '2M', '2A', '2AA'])
  }
}).export(module)
