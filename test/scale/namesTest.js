var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/scale/names')

vows.describe('scale/names').addBatch({
  'all scale names': function () {
    assert.equal(names().length, 108)
    // from scales.json
    assert(names().indexOf('major') > 0)
    // from aliases.json
    assert(names().indexOf('kumoi') > 0)
  }
}).export(module)
