var vows = require('vows')
var assert = require('assert')
var simple = require('../../lib/interval/simple')

vows.describe('Interval').addBatch({
  'simplify interval': function () {
    assert.equal(simple('M9'), 'M2')
    assert.equal(simple('M-9'), 'M-2')
    assert.equal(simple('M-9', true), 'M2')
    assert.equal(simple('P8'), 'P8')
  }
}).export(module)
