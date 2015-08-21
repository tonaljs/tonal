var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/interval/interval')

vows.describe('interval/interval').addBatch({
  'invalid interval number': function () {
    assert.throws(function () { interval(0) }, /valid/)
  },
  'build with interval number': function () {
    assert.equal(interval(1), 'P1')
    assert.equal(interval(9, 1), 'A9')
    assert.equal(interval(-1), 'P-1')
    assert.equal(interval(-10, -1), 'm-10')
  },
  'build with interval number and octave': function () {
    assert.equal(interval(1, 0, 1), 'P8')
    assert.equal(interval(5, 0, 1), 'P12')
    assert.equal(interval(9, -1, 1), 'm16')
    assert.equal(interval(1, 0, 1, true), 'P-8')
    assert.equal(interval(10, -1, 1, true), 'm-17')
  },
  'intervals from number and alterations': function () {
    var alters = [-3, -2, -1, 0, 1, 2, 3]
    assert.deepEqual(alters.map(function (alter) {
      return interval(5, alter)
    }), ['ddd5', 'dd5', 'd5', 'P5', 'A5', 'AA5', 'AAA5'])
    assert.deepEqual(alters.map(function (alter) {
      return interval(2, alter)
    }), ['dd2', 'd2', 'm2', 'M2', 'A2', 'AA2', 'AAA2'])
  }
}).export(module)
