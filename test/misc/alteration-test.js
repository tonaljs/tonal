var vows = require('vows')
var assert = require('assert')
var alteration = require('../../lib/misc/alteration')

vows.describe('Misc').addBatch({
  'alteration': function () {
    assert.equal(alteration('#'), 1)
    assert.equal(alteration('bbb'), -3)
  }
}).export(module)
