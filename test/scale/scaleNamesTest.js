var vows = require('vows')
var assert = require('assert')
var scaleNames = require('../../lib/scale/scaleNames')

vows.describe('scale/scaleNames').addBatch({
  'all scale names': function () {
    assert.equal(scaleNames().length, 108)
    // from scales.json
    assert(scaleNames().indexOf('major') > 0)
    // from scale-aliases.json
    assert(scaleNames().indexOf('kumoi') > 0)
  }
}).export(module)
