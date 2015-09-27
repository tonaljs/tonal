var vows = require('vows')
var assert = require('assert')
var triad = require('../../lib/collection/triad')
var scale = require('../../lib/scale/scale')

vows.describe('collection/triad').addBatch({
  'set triad': function () {
    assert.deepEqual(triad('C D E F G A B'), ['C', 'E', 'G'])
    assert.deepEqual(triad('a b c# d e f g'), ['A', 'C#', 'E'])
    assert.deepEqual(triad('bb d g'), null)
  },
  'scale triad': function () {
    assert.deepEqual(triad(scale('Bb', 'minor'), 4), ['Bb', 'Db', 'F', 'Ab'])
    assert.deepEqual(triad(scale('C', 'major'), 5), ['C', 'E', 'G', 'B', 'D'])
  }
}).export(module)
