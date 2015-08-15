var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/set/interval-set')

vows.describe('Scale').addBatch({
  'interval set from decimal': function () {
    assert.deepEqual(intervals(2773), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'interval set from binary': function () {
    assert.deepEqual(intervals('11'), ['P1', 'm2'])
    assert.deepEqual(intervals('101'), ['P1', 'M2'])
    assert.deepEqual(intervals('100000000001'), ['P1', 'M7'])
    assert.deepEqual(intervals('1000000000001'), ['P1', 'P8'])
  },
  'interval set from interval set': function () {
    assert.deepEqual(intervals(['P1', 'm3']), ['P1', 'm3'])
  },
  'interval set from note set': function () {
    assert.deepEqual(intervals(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
      ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  }
}).export(module)
