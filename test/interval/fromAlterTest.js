var vows = require('vows')
var assert = require('assert')
var fromAlter = require('../../lib/interval/fromAlter')

vows.describe('interval/fromAlter').addBatch({
  'fromAlter basic usage': function () {
    assert.equal(fromAlter(1), 'P1')
    assert.equal(fromAlter(9), 'M9')
    assert.equal(fromAlter(-1), 'P-1')
    assert.equal(fromAlter(-10), 'M-10')
    assert.throws(function () { fromAlter(0) })
    assert.equal(fromAlter('m2'), 'm2')
    assert.equal(fromAlter('m2', 1), 'M2')
    assert.equal(fromAlter('m2', 2), 'A2')
    assert.equal(fromAlter('m2', 3), 'AA2')
    assert.equal(fromAlter('m2', -1), 'd2')
    assert.equal(fromAlter('m2', -2), 'dd2')
    assert.equal(fromAlter('P-8'), 'P-8')
    assert.equal(fromAlter('P-8', 1), 'A-8')
    assert.equal(fromAlter('P-8', -1), 'd-8')

  },
  'intervals from number and alterations': function () {
    var alters = [-3, -2, -1, 0, 1, 2, 3]
    assert.deepEqual(alters.map(function (alter) {
      return fromAlter(5, alter)
    }), ['ddd5', 'dd5', 'd5', 'P5', 'A5', 'AA5', 'AAA5'])
    assert.deepEqual(alters.map(function (alter) {
      return fromAlter(2, alter)
    }), ['dd2', 'd2', 'm2', 'M2', 'A2', 'AA2', 'AAA2'])
  }
}).export(module)
