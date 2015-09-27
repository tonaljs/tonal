var vows = require('vows')
var assert = require('assert')
var find = require('../../lib/chord/find')

vows.describe('scale/find').addBatch({
  'first position chords': function () {
    assert.deepEqual(find('C E G'), 'CM')
    assert.deepEqual(find('C Eb G Bb D'), 'Cm9')
    assert.deepEqual(find(['G', 'B', 'D', 'F#']), 'GMaj7')
  }
}).export(module)
