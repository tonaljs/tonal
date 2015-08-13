var vows = require('vows')
var assert = require('assert')
var quality = require('../../lib/interval/quality')

vows.describe('Interval').addBatch({
  'interval quality': function () {
    assert.equal(quality('P5'), 'P')
    assert.equal(quality('d-6'), 'd')
  }
}).export(module)
