var vows = require('vows')
var assert = require('assert')
var toFifths = require('../../lib/pitch/toFifths')

vows.describe('pitch/toFifths').addBatch({
  'toFifths pitch': function () {
    assert.deepEqual(toFifths('C4'), [0, 0])
    assert.deepEqual(toFifths('C5'), [0, 1])
    assert.deepEqual(toFifths('D4'), [2, -1])
    assert.deepEqual(toFifths('G4'), [1, 0])
    assert.deepEqual(toFifths('G3'), [1, -1])
    assert.deepEqual(toFifths('F4'), [-1, 1])
    assert.deepEqual(toFifths('F3'), [-1, 0])
    assert.deepEqual(toFifths('B4'), [5, -2])
    assert.deepEqual(toFifths('Cb4'), [-7, 4])
    assert.deepEqual(toFifths('Cb5'), [-7, 5])
    assert.deepEqual(toFifths('C#4'), [7, -4])
    assert.deepEqual(toFifths('C##4'), [14, -8])
  },
  'toFifths interval': function () {
  }
}).export(module)
