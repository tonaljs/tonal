var vows = require('vows')
var assert = require('assert')
var transpose = require('../../lib/interval/transpose-chromatic')

vows.describe('Interval').addBatch({
  'chromatic transposition': function () {
    assert.equal(transpose(12, 'C'), 'C5')
  }
}).export(module)
