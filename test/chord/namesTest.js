var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/chord/names')

vows.describe('scale/name').addBatch({
  'first position chords': function () {
    assert.deepEqual(names('C E G'), ['CM', 'CMajor', 'C'])
    assert.deepEqual(names('C Eb G Bb D'), ['Cm9', 'C-9'])
  }
}).export(module)
