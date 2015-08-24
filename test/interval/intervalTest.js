var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/interval')

vows.describe('interval/interval').addBatch({
  'parse interval': function () {
    assert.equal(interval('P5').name, 'P5')
    assert.equal(interval('A2').quality, 'A')
    assert.equal(interval('A2', 0).name, 'M2')
    assert.equal(interval('A2', null, 1).name, 'A9')
    assert.equal(interval('P1', null, 2).name, 'P15')
  },
  'invalid interval number': function () {
    assert.throws(function () { interval(0) }, /valid/)
  },
  'build with interval number': function () {
    assert.equal(interval(1).name, 'P1')
    assert.equal(interval(9, 1).name, 'A9')
    assert.equal(interval(1, 0, 0, true).name, 'P-1')
    assert.equal(interval(10, -1, 0, true).name, 'm-10')
  },
  'build with interval number and octave': function () {
    assert.equal(interval(1, 0, 1).name, 'P8')
    assert.equal(interval(5, 0, 1).name, 'P12')
    assert.equal(interval(9, -1, 1).name, 'm16')
    assert.equal(interval(1, 0, 1, true).name, 'P-8')
    assert.equal(interval(10, -1, 1, true).name, 'm-17')
  },
  'intervals from number and alterations': function () {
    assert.deepEqual([-2, -1, 0, 1, 2].map(function (alter) {
      return interval(5, alter).name
    }), ['dd5', 'd5', 'P5', 'A5', 'AA5'])
    assert.deepEqual([-3, -2, -1, 0, 1, 2].map(function (alter) {
      return interval(2, alter).name
    }), ['dd2', 'd2', 'm2', 'M2', 'A2', 'AA2'])
  }
}).export(module)
