var vows = require('vows')
var assert = require('assert')
var pitch = require('../../lib/pitch/pitch')
var interval = require('../../lib/interval/interval')
var list = require('../../lib/list/list')

vows.describe('sequence/sequence').addBatch({
  'create pitch list': function () {
    assert.deepEqual(list('C D', pitch), ['C', 'D'])
    assert.deepEqual(list(['C4', 'D'], pitch), ['C4', 'D'])
    assert.deepEqual(list('C D P1', pitch), null)
  },
  'create interval list': function () {
    assert.deepEqual(list('P1 M2', interval), ['P1', 'M2'])
  },
  'create a list without validator': function () {
    assert.deepEqual(list('A B'), ['A', 'B'])
  }
}).export(module)
