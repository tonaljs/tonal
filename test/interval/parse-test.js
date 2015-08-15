var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/interval/parse')

vows.describe('Interval').addBatch({
  'parse': function () {
    assert.deepEqual(parse('P5'), { q: 'P', d: 1, n: 5 })
    assert.deepEqual(parse('M-2'), { q: 'M', d: -1, n: 2 })
  }
}).export(module)
