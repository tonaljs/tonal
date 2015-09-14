var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/build')

vows.describe('interval/build').addBatch({
  'parse interval': function () {
    assert.equal(interval('5P').name, '5P')
    assert.equal(interval('2A').quality, 'A')
    assert.equal(interval('1P', 0).name, '1P')
    assert.equal(interval('1P', 1).name, '8P')
    assert.equal(interval('1P', 2).name, '15P')
    assert.equal(interval('15P', 0).name, '1P')
    assert.equal(interval('15P', 1).name, '8P')
    assert.equal(interval('2A', 1).name, '9A')
    assert.equal(interval('2A', null, 0).name, '2M')
  },
  'invalid intervals': function () {
    assert.equal(interval(0), null)
    assert.equal(interval(), null)
  },
  'edge cases': function () {
    assert.equal(interval(-5, 0).name, '-5P')
  },
  'build with interval number': function () {
    assert.equal(interval(1).name, '1P')
    assert.equal(interval(9, null, 1).name, '9A')
    assert.equal(interval(-1, 0, 0).name, '-1P')
    assert.equal(interval(-10, 0, -1).name, '-3m')
  },
  'build with interval number and octave': function () {
    assert.equal(interval(1, 1).name, '8P')
    assert.equal(interval(5, 1).name, '12P')
    assert.equal(interval(9, 0, -1).name, '2m')
    assert.equal(interval(-1, 1, 0).name, '-8P')
    assert.equal(interval(-10, 2, -1).name, '-17m')
  },
  'intervals from number and alterations': function () {
    assert.deepEqual([-2, -1, 0, 1, 2].map(function (alter) {
      return interval(5, 0, alter).name
    }), ['5dd', '5d', '5P', '5A', '5AA'])
    assert.deepEqual([-3, -2, -1, 0, 1, 2].map(function (alter) {
      return interval(2, 0, alter).name
    }), ['2dd', '2d', '2m', '2M', '2A', '2AA'])
  }
}).export(module)
