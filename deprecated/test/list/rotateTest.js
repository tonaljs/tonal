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
    assert.deepEqual(rotate('P1 M2 M3', 1), [ 'P1', 'M2', 'M-2' ])
    assert.deepEqual(rotate('P1 M2 M3', 4), [ 'P1', 'M2', 'M-2' ])
    assert.deepEqual(rotate('P1 M2 M3', 5), [ 'P1', 'M-3', 'M-2' ])
  },
  'rotate notes octave': function () {
    assert.deepEqual(rotate('C D E', 1, true), ['D4', 'E4', 'C5'])
    assert.deepEqual(rotate('C D E', 4, true), ['D4', 'E4', 'C5'])
    assert.deepEqual(rotate('C D E', 5, true), ['E4', 'C5', 'D5'])
  },
  'rotate intervals octave': function () {
    assert.deepEqual(rotate('P1 M2 M3', 1, true), ['P1', 'M2', 'm7'])
    assert.deepEqual(rotate('P1 M2 M3', 4, true), ['P1', 'M2', 'm7'])
    assert.deepEqual(rotate('P1 M2 M3', 5, true), ['P1', 'm6', 'm7'])
  }
}).export(module)
