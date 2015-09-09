var vows = require('vows')
var assert = require('assert')
var mode = require('../../lib/scale/mode')

vows.describe('Scale').addBatch({
  'Scale modes': function () {
    assert.deepEqual(mode('C major'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
    assert.deepEqual(mode('C major', 1), ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'])
    assert.deepEqual(mode('C major', 2), ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'])
  }
}).export(module)
