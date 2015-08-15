var vows = require('vows')
var assert = require('assert')
var dictionary = require('../../lib/set/dictionary')

vows.describe('Set').addBatch({
  'interval set from dictionary': function () {
    var scales = dictionary({'major': 2773})
    assert.deepEqual(scales('major'), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'note set from dictionary': function () {
    var scales = dictionary({'major': 2773})
    assert.deepEqual(scales('C major'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  }
}).export(module)
