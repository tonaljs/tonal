var vows = require('vows')
var assert = require('assert')
var triad = require('../../lib/chord/triad')

vows.describe('chord/triad').addBatch({
  'note triads': function () {
    assert.deepEqual(triad('C major'), [ 'C4', 'E4', 'G4' ])
    assert.deepEqual(triad('C major', 4), [ 'C4', 'E4', 'G4', 'B4' ])
    // TODO
    // assert.deepEqual(triad('C major', 5), [ 'C4', 'E4', 'G4', 'B4', 'D5' ])
  }
}).export(module)
