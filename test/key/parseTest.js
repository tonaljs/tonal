var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/key/parse')

vows.describe('key/parse').addBatch({
  'major with sharps': function () {
    assert.deepEqual(parse('C major'), { tonic: 'C', type: 'major' })
    assert.deepEqual(parse('C'), { tonic: 'C', type: 'major' })
    assert.deepEqual(parse('g major'), { tonic: 'G', type: 'major' })
    assert.deepEqual(parse('bbb'), { tonic: 'Bbb', type: 'major' })
    assert.deepEqual(parse('Eb minor'), { tonic: 'Eb', type: 'minor' })
  }
}).export(module)
