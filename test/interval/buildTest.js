var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/build')

vows.describe('interval/build').addBatch({
  'from number': function () {
    assert.equal(interval(1), '1P')
  },
  'from string': function () {
    assert.equal(interval('5P'), '5P')
    assert.equal(interval('2A'), '2A')
    assert.equal(interval('2A', 0, null), '2M')
  },
  'with quality': function () {
    assert.equal(interval(1, 'A'), '1A')
    assert.equal(interval(2, 'm'), '2m')
    assert.equal(interval(2, 'P'), null)
    assert.equal(interval('3M', 'A'), '3A')
    assert.equal(interval('4P', 'M'), null)
  },
  'with alterations': function () {
    assert.equal(interval(9, 1), '9A')
    assert.equal(interval(-1, 0), '-1P')
    assert.equal(interval(-10, -1), '-10m')
    assert.equal(interval('2A', 0), '2M')
  },
  'with octave': function () {
    assert.equal(interval('1P', null, 0), '1P')
    assert.equal(interval('1P', null, 1), '8P')
    assert.equal(interval('1P', null, 2), '15P')
    assert.equal(interval('15P', null, 0), '1P')
    assert.equal(interval('15P', null, 1), '8P')
    assert.equal(interval('2A', null, 1), '9A')
    assert.equal(interval(1, null, 1), '8P')
    assert.equal(interval(5, null, 1), '12P')
  },
  'invalid intervals': function () {
    assert.equal(interval(0), null)
    assert.equal(interval(), null)
    assert.equal(interval('2P'), null)
  },
  'edge cases': function () {
    assert.equal(interval(-5, null, 0), '-5P')
    assert.equal(interval(1, null, -1), '-8P')
  },
  'all on': function () {
    assert.equal(interval(9, -1, 0), '2m')
    assert.equal(interval(-1, 0, 1), '-8P')
    assert.equal(interval(-10, -1, 2), '-17m')
    assert.equal(interval(2, 'A', -1), '-9A')
  },
  'from number and alterations': function () {
    assert.deepEqual([-3, -2, -1, 0, 1, 2, 3].map(function (alter) {
      return interval(5, alter, 0)
    }), [null, '5dd', '5d', '5P', '5A', '5AA', null])
    assert.deepEqual([-4, -3, -2, -1, 0, 1, 2, 3].map(function (alter) {
      return interval(2, alter, 0)
    }), [null, '2dd', '2d', '2m', '2M', '2A', '2AA', null])
  }
}).export(module)
