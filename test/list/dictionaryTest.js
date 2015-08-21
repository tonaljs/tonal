var vows = require('vows')
var assert = require('assert')
var dictionary = require('../../lib/list/dictionary')

vows.describe('data/listDict').addBatch({
  'interval list from dictionary': function () {
    var scale = dictionary({'major': 2773})
    assert.deepEqual(scale('major'), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'note list from dictionary': function () {
    var scale = dictionary({'major': 2773})
    assert.deepEqual(scale('C major'), ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'])
  }
}).export(module)
