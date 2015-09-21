var vows = require('vows')
var assert = require('assert')
var allScales = require('../../lib/scale/allScales')

vows.describe('scale/allScales').addBatch({
  'scale allScales': function () {
    assert.equal(allScales().length, 108)
    // from scales.json
    assert(allScales().indexOf('major') > 0)
    // from scale-aliases.json
    assert(allScales().indexOf('kumoi') > 0)
  }
}).export(module)
