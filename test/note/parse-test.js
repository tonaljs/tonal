var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/note/parse')

vows.describe('Note').addBatch({
  'parse': function () {
    assert.deepEqual(parse('C#2'), { note: 'C#2', step: 'C', acc: '#', oct: 2 })
    assert.deepEqual(parse('bbb5'), { note: 'bbb5', step: 'B', acc: 'bb', oct: 5 })
  },
  'parse double sharps with x': function () {
    assert.deepEqual(parse('cx2'), { note: 'cx2', step: 'C', acc: '##', oct: 2 })
    assert.deepEqual(parse('cxx2'), { note: 'cxx2', step: 'C', acc: '####', oct: 2 })
  },
  'name prefix': function () {
    assert.throws(function () { parse('C#3m') })
    assert.deepEqual(parse('C#3maj7', true), { note: 'C#', step: 'C', acc: '#', oct: 4 })
    assert.deepEqual(parse('Cb3maj7', true), { note: 'Cb', step: 'C', acc: 'b', oct: 4 })
  }
}).export(module)
