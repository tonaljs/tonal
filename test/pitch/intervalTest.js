var vows = require('vows')
var assert = require('assert')
var interval = require('../../lib/pitch/interval')

vows.describe('pitch/interval').addBatch({
  'edges': function () {
    assert.equal(interval('E', 'F'), '2m')
    assert.equal(interval('B4', 'C5'), '2m')
    assert.equal(interval('eb', 'f#'), '2A')
    assert.equal(interval('a', 'c'), '-6M')
    assert.equal(interval('a3', 'c4'), '3m')
    assert.equal(interval('a', 'd'), '-5P')
    assert.equal(interval('c4', 'c3'), '-8P')
    assert.equal(interval('d4', 'c3'), '-9M')
  },
  'interval from two notes': function () {
    assert.equal(interval('D', 'F'), '3m')
    assert.equal(interval('C', 'D'), '2M')
    assert.equal(interval('C#', 'D'), '2m')
    assert.equal(interval('C', 'Db'), '2m')
    assert.equal(interval('D', 'C'), '-2M')
    assert.equal(interval('C4', 'C5'), '8P')
    assert.equal(interval('C4', 'D5'), '9M')
  }
}).export(module)
