var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/pitch/distance')

vows.describe('pitch/distance').addBatch({
  'edges': function () {
    assert.equal(distance('E', 'F'), 'm2')
    assert.equal(distance('B4', 'C5'), 'm2')
    assert.equal(distance('eb', 'f#'), 'A2')
  },
  'distances to a tonic': function () {
    var notes = 'C D E F G A B C5'.split(' ')
    assert.deepEqual(notes.map(distance.from('C4')),
      ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7', 'P8'])
    assert.deepEqual(notes.map(distance.from('C3')),
      ['P8', 'M9', 'M10', 'P11', 'P12', 'M13', 'M14', 'P15'])
  },
  'distance from two notes': function () {
    assert.equal(distance('D', 'F'), 'm3')
    assert.equal(distance('C', 'D'), 'M2')
    assert.equal(distance('C#', 'D'), 'm2')
    assert.equal(distance('C', 'Db'), 'm2')
    assert.equal(distance('D', 'C'), 'M-2')
    assert.equal(distance('C4', 'C5'), 'P8')
    assert.equal(distance('C4', 'D5'), 'M9')
  }
}).export(module)
