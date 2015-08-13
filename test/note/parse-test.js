var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/note/parse')

vows.describe('Note').addBatch({
  'parse': function () {
    assert.deepEqual(parse('C#2'), ['C', '#', 2])
    assert.deepEqual(parse('bbb5'), ['B', 'bb', 5])
  }
}).export(module)
