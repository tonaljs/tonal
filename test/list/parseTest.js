var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/list/parse')

vows.describe('list/parse').addBatch({
  'parse notes': function () {
    assert.deepEqual(parse('bb3'), ['Bb3'])
    assert.deepEqual(parse('C D E'), ['C4', 'D4', 'E4'])
  },
  'parse intervals': function () {
    assert.deepEqual(parse('P-1 M-2 M-3'), ['P-1', 'M-2', 'M-3'])
  },
  'parse binary': function () {
    assert.deepEqual(parse('11'), ['P1', 'm2'])
    assert.deepEqual(parse('101'), ['P1', 'M2'])
    assert.deepEqual(parse('100000000001'), ['P1', 'M7'])
    assert.deepEqual(parse('1000000000001'), ['P1', 'P8'])
  },
  'parse decimal': function () {
    assert.deepEqual(parse(1), ['P1'])
    assert.deepEqual(parse(3), ['P1', 'm2'])
    assert.deepEqual(parse(5), ['P1', 'M2'])
    assert.deepEqual(parse(2773), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'invalid lists': function () {
    assert.deepEqual(parse('M-2 M-3'), null)
  }
}).export(module)
