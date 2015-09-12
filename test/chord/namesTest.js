var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/chord/names')

vows.describe('scale/name').addBatch({
  'first position chords': function () {
    assert.deepEqual(names('C E G'), ['CM', 'CMajor', 'C'])
    assert.deepEqual(names('C Eb G Bb D'), ['Cm9', 'C-9'])
    assert.deepEqual(names(['G', 'B', 'D', 'F#']), ['GM7', 'Gmaj7', 'GMaj7'])
  }
}).export(module)
