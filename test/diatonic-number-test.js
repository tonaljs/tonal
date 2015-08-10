var vows = require('vows')
var assert = require('assert')
var diatonicNumber = require('../lib/diatonic-number')

vows.describe('diatonic number').addBatch({
  'diatonic number': function () {
    assert.equal(diatonicNumber('C', 'C'), 1)
    assert.equal(diatonicNumber('C', 'D'), 2)
    assert.equal(diatonicNumber('C', 'B'), 7)
    assert.equal(diatonicNumber('C', 'B', true), -2)
    assert.equal(diatonicNumber('C', 'G', false), 5)
    assert.equal(diatonicNumber('C', 'G', true), -4)
  }
}).export(module)
