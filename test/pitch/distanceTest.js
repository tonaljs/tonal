var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/pitch/distance')

vows.describe('pitch/distance').addBatch({
  'edges': function () {
    assert.equal(distance('E', 'F'), '2m')
    assert.equal(distance('B4', 'C5'), '2m')
    assert.equal(distance('eb', 'f#'), '2A')
    assert.equal(distance('a', 'c'), '-6M')
    assert.equal(distance('a3', 'c4'), '3m')
    assert.equal(distance('a', 'd'), '-5P')
  },
  'distances to a tonic': function () {
    var notes = 'C D E F G A B C5'.split(' ')
    assert.deepEqual(notes.map(distance.from('C4')),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M', '8P'])
    assert.deepEqual(notes.map(distance.from('C3')),
      ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'])
  },
  'distance from two notes': function () {
    assert.equal(distance('D', 'F'), '3m')
    assert.equal(distance('C', 'D'), '2M')
    assert.equal(distance('C#', 'D'), '2m')
    assert.equal(distance('C', 'Db'), '2m')
    assert.equal(distance('D', 'C'), '-2M')
    assert.equal(distance('C4', 'C5'), '8P')
    assert.equal(distance('C4', 'D5'), '9M')
  }
}).export(module)
