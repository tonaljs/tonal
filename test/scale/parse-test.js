var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/scale/parse')

vows.describe('Scale').addBatch({
  'no tonic': function () {
    assert.deepEqual(parse('major'), { tonic: null, type: 'major' })
    assert.deepEqual(parse(' minor '), { tonic: null, type: 'minor' })
    assert.deepEqual(parse(' minor melodic '), { tonic: null, type: 'minor melodic' })
  },
  'with tonic': function () {
    assert.deepEqual(parse('C#3 major '), { tonic: 'C#3', type: 'major' })
    assert.deepEqual(parse('A    minor melodic '), { tonic: 'A', type: 'minor melodic' })
  }
}).export(module)
