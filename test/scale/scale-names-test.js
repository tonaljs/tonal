var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/scale/scale-names')

vows.describe('Scale').addBatch({
  'scale names': function () {
    assert.equal(names().length, 108)
  }
}).export(module)
