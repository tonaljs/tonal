var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/chord/parse')

vows.describe('chord/parse').addBatch({
  'no tonic': function () {
    assert.deepEqual(parse('4'), { tonic: null, type: '4' })
    assert.deepEqual(parse('maj7 '), { tonic: null, type: 'maj7' })
    assert.deepEqual(parse(' 79  '), { tonic: null, type: '79' })
  },
  'with tonic': function () {
    assert.deepEqual(parse('C#maj7'), { tonic: 'C#', type: 'maj7' })
    assert.deepEqual(parse('A    minor melodic '), { tonic: 'A', type: 'minor melodic' })
    assert.deepEqual(parse('Cb3maj7'), { tonic: 'Cb', type: '3maj7' })
  },
  'tonic must be uppercase': function () {
    assert.deepEqual(parse('add9'), { tonic: null, type: 'add9' })
  }
}).export(module)
