var vows = require('vows')
var assert = require('assert')
var pitchStr = require('../../lib/pitch/pitchStr')

vows.describe('pitch/pitchStr').addBatch({
  'pitchStr': function () {
    assert.equal(pitchStr([1, 0, 0]), 'C4')
    assert.equal(pitchStr([5, 0, 0]), 'G4')
    assert.equal(pitchStr([6, 0, 0]), 'A4')
    assert.equal(pitchStr([7, 1, -1]), 'B#3')
    assert.equal(pitchStr([2, -1, 0]), 'Db4')
    assert.equal(pitchStr([5, -3, -3]), 'Gbbb1')
  },
  'pitchStr class only': function () {
    assert.equal(pitchStr([1, -3, 0], true), 'Cbbb')
    assert.equal(pitchStr([5, 1, -2], true), 'G#')
  },
  'not valid': function () {
    assert.equal(pitchStr([0, 0, 0]), null)
    assert.equal(pitchStr([-1, 0, 0]), null)
    assert.equal(pitchStr([1, 6, 0]), null)
  }
}).export(module)
