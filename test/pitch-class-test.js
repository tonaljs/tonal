var vows = require('vows')
var assert = require('assert')
var pitchClass = require('../lib/pitch-class.js')

vows.describe('Pitch class').addBatch({
  'get pitch class': function () {
    assert.equal(pitchClass('C', 1), 'C')
    assert.equal(pitchClass('C', 2), 'D')
    assert.equal(pitchClass('C', -2), 'B')
    assert.equal(pitchClass('C', 8), 'C')
    assert.equal(pitchClass('C', 9), 'D')
    assert.equal(pitchClass('C', -9), 'B')
  }
}).export(module)
