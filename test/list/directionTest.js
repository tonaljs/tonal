var vows = require('vows')
var assert = require('assert')
var direction = require('../../lib/list/direction')

vows.describe('list/direction').addBatch({
  'notes up': function () {
    assert.deepEqual(direction('C D E'), ['C4', 'D4', 'E4'])
    assert.deepEqual(direction('C4 D5 E4'), ['C4', 'D5', 'E5'])
    assert.deepEqual(direction('C4 D7 A4'), ['C4', 'D7', 'A7'])
    assert.deepEqual(direction('C B A'), ['C4', 'B4', 'A5'])
  },
  'notes down': function () {
    assert.deepEqual(direction('C B A', -1), ['C4', 'B3', 'A3'])
    assert.deepEqual(direction('C D E', -1), ['C4', 'D3', 'E2'])
    assert.deepEqual(direction('G F E D C B A', -1), ['G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3'])
    assert.deepEqual(direction('C A2 B', -1), ['C4', 'A2', 'B1'])
  }
}).export(module)
