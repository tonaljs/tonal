var vows = require('vows')
var assert = require('assert')
var name = require('../../lib/chord/name')

vows.describe('scale/name').addBatch({
  'first position chords': function () {
    assert.deepEqual(name('C E G'), 'CM')
    assert.deepEqual(name('C Eb G Bb D'), 'Cm9')
    assert.deepEqual(name(['G', 'B', 'D', 'F#']), 'GMaj7')
  }
}).export(module)
