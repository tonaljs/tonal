var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/note/parse')

vows.describe('Note').addBatch({
  'parse': function () {
    assert.deepEqual(parse('C#2'), { step: 'C', acc: '#', oct: 2 })
    assert.deepEqual(parse('bbb5'), { step: 'B', acc: 'bb', oct: 5 })
  }
}).export(module)
