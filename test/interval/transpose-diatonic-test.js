var vows = require('vows')
var assert = require('assert')
var transpose = require('../../lib/interval/transpose-diatonic')

vows.describe('Interval').addBatch({
  'diatonic transposition': function () {
    assert.equal(transpose('P5', 'C'), 'G4')
  }
}).export(module)
