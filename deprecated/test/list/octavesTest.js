var vows = require('vows')
var assert = require('assert')
var octaves = require('../../lib/list/octaves')

vows.describe('list/octaves').addBatch({
  'note octaves': function () {
    assert.deepEqual(octaves('C D E'), ['C4', 'D4', 'E4'])
    assert.deepEqual(octaves('C D E', 1), ['C4', 'D4', 'E4', 'C5'])
    assert.deepEqual(octaves('C D E', 2), ['C4', 'D4', 'E4', 'C5', 'D5', 'E5', 'C6'])
    assert.deepEqual(octaves('C D E', 3),
      ['C4', 'D4', 'E4', 'C5', 'D5', 'E5', 'C6', 'D6', 'E6', 'C7'])
  },
  'interval octaves': function () {
    assert.deepEqual(octaves('P1 M2 M3'), ['P1', 'M2', 'M3'])
    assert.deepEqual(octaves('P1 M2 M3', 1), ['P1', 'M2', 'M3', 'P8'])
    assert.deepEqual(octaves('P1 M2 M3', 2), ['P1', 'M2', 'M3', 'P8', 'M9', 'M10', 'P15'])
    assert.deepEqual(octaves('P1 M2 M3', 3),
      ['P1', 'M2', 'M3', 'P8', 'M9', 'M10', 'P15', 'M16', 'M17', 'P22'])
  }
}).export(module)
