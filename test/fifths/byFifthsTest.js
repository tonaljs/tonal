var vows = require('vows')
var assert = require('assert')
var byFifths = require('../../lib/fifths/byFifths')

vows.describe('fifths/fifths').addBatch({
  'sort pitch classes': function () {
    assert.deepEqual('C# G# F#'.split(' ').sort(byFifths()), ['F#', 'C#', 'G#'])
    assert.deepEqual('Eb Ab Bb'.split(' ').sort(byFifths()), ['Ab', 'Eb', 'Bb'])
  }
}).export(module)
