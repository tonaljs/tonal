var vows = require('vows')
var assert = require('assert')
var voicings = require('../../lib/chord/voicings')

vows.describe('scale/voicings').addBatch({
  'voicing names': function () {
    assert.deepEqual(voicings('Maj7'), ['left-hand-A', 'left-hand-B',
      'left-hand-C', 'two-hand-A', 'two-hand-B', 'two-hand-C'])
    assert.deepEqual(voicings('M7'), voicings('Maj7'))
  },
  'voicing intervals': function () {
    assert.deepEqual(voicings('Maj7', 'left-hand-A'), ['3M', '5P', '7M'])
  }
}).export(module)
