var vows = require('vows')
var assert = require('assert')
var harmonizer = require('../../lib/harmonizer/harmonizer')

vows.describe('harmonizer/harmonizer').addBatch({
  'intervals array harmonizer': function () {
    var h = harmonizer(['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
    assert.deepEqual(h('C2'), ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2'])
  },
  'interval list': function () {
    var h = harmonizer('P1 M9')
    assert.deepEqual(h('C2'), ['C2', 'D3'])
  },
  'decimal number': function () {
    assert.deepEqual(harmonizer(2773)('C2'), ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2'])
  },
  'invalid source': function () {
    assert.equal(harmonizer()(), null)
    assert.equal(harmonizer('P1 C2')(), null)
  }
}).export(module)
