var vows = require('vows')
var assert = require('assert')
var fromCollection = require('../../lib/binaryScale/fromCollection')

vows.describe('binaryScale/fromCollection').addBatch({
  'pitches to binary': function () {
    assert.equal(fromCollection('C D E'), '101010000000')
    assert.equal(fromCollection('C4 D5 E4'), '101010000000')
    assert.equal(fromCollection('C4 C4 C5 C6 C7'), '100000000000')
    assert.equal(fromCollection(['G', 'B', 'D', 'F#']), '100010010001')
  },
  'intervals to binary': function () {
    assert.equal(fromCollection('1P 2M 3M'), '101010000000')
    assert.equal(fromCollection('2M 3M 4P'), '101100000000')
    assert.equal(fromCollection('1P'), '100000000000')
    assert.equal(fromCollection('1P 8P'), '100000000000')
    assert.equal(fromCollection('1P 8P 9M'), '101000000000')
  }
}).export(module)
