var vows = require('vows')
var assert = require('assert')
var harmonizer = require('../../lib/interval/harmonizer')

vows.describe('interval/harmonizer').addBatch({
  'harmonize tonic': function () {
    var h = harmonizer(['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
    assert.deepEqual(h('C2'), ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2'])
  },
  'pitch classes only': function () {
    var h = harmonizer('-2M -3M')
    assert.deepEqual(h('D3', true), ['C', 'Bb'])
  }
}).export(module)
