var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/list/intervals')

vows.describe('list/intervals').addBatch({
  'interval list from decimal': function () {
    assert.deepEqual(intervals(2773), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'interval list from binary': function () {
    assert.deepEqual(intervals('100000000001'), ['P1', 'M7'])
    assert.deepEqual(intervals('11'), null)
  },
  'interval list from interval list': function () {
    assert.deepEqual(intervals(['P1', 'm3']), ['P1', 'm3'])
    assert.deepEqual(intervals('P1 m3'), ['P1', 'm3'])
    assert.deepEqual(intervals(['P-1', 'm-3']), ['P-1', 'm-3'])
  },
  'interval list from note list': function () {
    assert.deepEqual(intervals(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
      ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
    assert.deepEqual(intervals('C D E F G A B'), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  }
}).export(module)
