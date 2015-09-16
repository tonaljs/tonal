var vows = require('vows')
var assert = require('assert')
var triadic = require('../../lib/incubator/triadic')

vows.describe('scale/triadic').addBatch({
  'scale triadic': function () {
    assert.deepEqual(triadic('major'), ['1P', '3M', '5P', '7M', '9M', '11P', '13M'])
    assert.deepEqual(triadic('minor', 3), ['1P', '3m', '5P'])
    assert.deepEqual(triadic('melodic minor', 4), ['1P', '3m', '5P', '7M'])
  }
}).export(module)
