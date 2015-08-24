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
    assert.equal(add('P4', 'P-5'), 'M-2')
    assert.equal(add('P1', 'm-2'), 'm-2')
    assert.equal(add('P1', 'm-9'), 'm-9')
    assert.equal(add('m-9', 'P8'), 'm-2')
    assert.equal(add('P8', 'm-9'), 'm-2')
    assert.equal(add('P8', 'M-2'), 'm7')
  },
  'add descending intervals': function () {
    assert.equal(add('M-2', 'M-2'), 'M-3')
  }
}).export(module)
