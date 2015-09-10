var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/harmonizer/intervals')

vows.describe('intervals/intervals').addBatch({
  'intervals from array': function () {
    assert.deepEqual(intervals(['M2', 'M3']), ['M2', 'M3'])
  },
  'intervals from string list': function () {
    assert.deepEqual(intervals('M3 P-5'), ['M3', 'P-5'])
  },
  'intervals from decimal number': function () {
    assert.deepEqual(intervals(2773), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'intervals from binary': function () {
    assert.deepEqual(intervals('101'), ['P1', 'M2'])
  },
  'invalid source': function () {
    assert.equal(intervals(), null)
    assert.equal(intervals('P1 C2'), null)
  }
}).export(module)
