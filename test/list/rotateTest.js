var vows = require('vows')
var assert = require('assert')
var rotate = require('../../lib/list/rotate')

vows.describe('list/rotate').addBatch({
  'rotate notes': function () {
    assert.deepEqual(rotate('C D E F G A B', 1),
      ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C4'])
    assert.deepEqual(rotate('C D E F G A B', 2),
      ['E4', 'F4', 'G4', 'A4', 'B4', 'C4', 'D4'])
    assert.deepEqual(rotate('C D E F G A B', -1),
      ['B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'])
  },
  'rotate intervals': function () {
    assert.deepEqual(rotate('P1 M2 M3', 1), ['M2', 'M3', 'P1'])
    assert.deepEqual(rotate('P1 M2 M3', 4), ['M2', 'M3', 'P1'])
    assert.deepEqual(rotate('P1 M2 M3', 5), ['M3', 'P1', 'M2'])
  }
}).export(module)
