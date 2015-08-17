var vows = require('vows')
var assert = require('assert')
var generator = require('../../lib/data/set-generator')

vows.describe('Set').addBatch({
  'interval set from generator': function () {
    var scale = generator({'major': 2773})
    assert.deepEqual(scale('major'), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'note set from generator': function () {
    var scale = generator({'major': 2773})
    assert.deepEqual(scale('C major'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  }
}).export(module)
