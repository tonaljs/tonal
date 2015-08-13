var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/interval/parse')

vows.describe('Interval').addBatch({
  'parse': function () {
    assert.deepEqual(parse('P5'), ['P', 1, 5])
    assert.deepEqual(parse('M-2'), ['M', -1, 2])
  }
}).export(module)
