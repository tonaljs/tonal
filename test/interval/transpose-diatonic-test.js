var vows = require('vows')
var assert = require('assert')
var transpose = require('../../lib/interval/transpose-interval')

vows.describe('Interval').addBatch({
  'transpose using an interval': function () {
    assert.equal(transpose('P1', 'C'), 'C4')
  }
}).export(module)
