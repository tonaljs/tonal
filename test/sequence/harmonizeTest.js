var vows = require('vows')
var assert = require('assert')
var harmonize = require('../../lib/sequence/harmonize')

vows.describe('sequence/harmonize').addBatch({
  'harmonize': function () {
    assert.deepEqual(harmonize('C2', ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']),
      ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2'])
    assert.deepEqual(harmonize('D3', 'M2 M3'), ['E3', 'F#3'])
  }
}).export(module)
