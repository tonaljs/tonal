var vows = require('vows')
var assert = require('assert')
var harmonize = require('../../lib/collection/harmonize')

vows.describe('collection/harmonize').addBatch({
  'harmonize': function () {
    assert.deepEqual(harmonize('C2', ['1P', '2M', '3M', '4P', '5P', '6M', '7M']),
      ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2'])
    assert.deepEqual(harmonize('D3', '2M 3M'), ['E3', 'F#3'])
  },
  'pitch classes only': function () {
    assert.deepEqual(harmonize('D3', '-2M -3M', true), ['C', 'Bb'])
  }
}).export(module)
