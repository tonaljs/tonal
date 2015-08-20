var vows = require('vows')
var assert = require('assert')
var build = require('../../lib/interval/build')

vows.describe('interval/build').addBatch({
  'invalid interval number': function () {
    assert.throws(function () { build(0) })
  },
  'build with interval number': function () {
    assert.equal(build(1), 'P1')
    assert.equal(build(9, 1), 'A9')
    assert.equal(build(-1), 'P-1')
    assert.equal(build(-10, -1), 'm-10')
  },
  'build with interval number and octave': function () {
    assert.equal(build(1, 0, 1), 'P8')
    assert.equal(build(5, 0, 1), 'P12')
    assert.equal(build(9, -1, 1), 'm16')
    assert.equal(build(-1, 0, 1), 'P-8')
    assert.equal(build(-10, -1, 1), 'm-17')
  },
  'build with interval and alteration': function () {
    assert.equal(build('m2'), 'm2')
    assert.equal(build('m2', 1), 'M2')
    assert.equal(build('m2', 2), 'A2')
    assert.equal(build('m2', 3), 'AA2')
    assert.equal(build('m2', -1), 'd2')
    assert.equal(build('m2', -2), 'dd2')
    assert.equal(build('P-8'), 'P-8')
    assert.equal(build('P-8', 1), 'A-8')
    assert.equal(build('P-8', -1), 'd-8')

  },
  'intervals from number and alterations': function () {
    var alters = [-3, -2, -1, 0, 1, 2, 3]
    assert.deepEqual(alters.map(function (alter) {
      return build(5, alter)
    }), ['ddd5', 'dd5', 'd5', 'P5', 'A5', 'AA5', 'AAA5'])
    assert.deepEqual(alters.map(function (alter) {
      return build(2, alter)
    }), ['dd2', 'd2', 'm2', 'M2', 'A2', 'AA2', 'AAA2'])
  }
}).export(module)
