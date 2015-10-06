var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/pitch/parse')

vows.describe('pitch/parse').addBatch({
  'parse pitch': function () {
    assert.deepEqual(parse('C4'), [1, 0, 0])
    assert.deepEqual(parse('G4'), [5, 0, 0])
    assert.deepEqual(parse('A4'), [6, 0, 0])
    assert.deepEqual(parse('B#3'), [7, 1, -1])
    assert.deepEqual(parse('Db4'), [2, -1, 0])
  },
  'parse double sharps': function () {
    assert.deepEqual(parse('Ex'), [3, 2, 0])
    assert.deepEqual(parse('Exx'), [3, 4, 0])
  },
  'parse interval': function () {
    assert.deepEqual(parse('1P'), [1, 0, 0])
    assert.deepEqual(parse('8P'), [1, 0, 1])
    assert.deepEqual(parse('2M'), [2, 0, 0])
    assert.deepEqual(parse('7m'), [7, -1, 0])
    assert.deepEqual(parse('5A'), [5, 1, 0])
    assert.deepEqual(parse('9m'), [2, -1, 1])
    assert.deepEqual(parse('-2M'), [7, -1, -1])
    assert.deepEqual(parse('-9M'), [7, -1, -2])
    assert.deepEqual(parse('-1P'), [1, 0, 0])
    assert.deepEqual(parse('-8P'), [1, 0, -1])
  }
}).export(module)
