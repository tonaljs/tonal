var vows = require('vows')
var assert = require('assert')
var add = require('../../lib/interval/add')

vows.describe('interval/add').addBatch({
  'add ascending intervals': function () {
    assert.equal(add('M2', 'M2'), 'M3')
    assert.equal(add('M2', 'm2'), 'm3')
    assert.equal(add('M2', 'P8'), 'M9')
    assert.equal(add('P4', 'P4'), 'm7')
  },
  'add ascending descending intervals': function () {
    assert.equal(add('M2', 'M-2'), 'P1')
    assert.equal(add('P5', 'M-2'), 'P4')
    assert.equal(add('M-2', 'P5'), 'P4')
  },
  'add descending intervals': function () {
    assert.equal(add('M-2', 'M-2'), 'M-3')
  }
}).export(module)
