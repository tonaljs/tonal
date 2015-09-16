var vows = require('vows')
var assert = require('assert')
var cycle = require('../../lib/incubator/cycle')

vows.describe('incubator/cycle').addBatch({
  'cycle': function () {
    assert.deepEqual(cycle('D', '5P', 12).join(' '), 'D A E B F# C# G# D# A# E# B# F##')
    assert.deepEqual(cycle('D', '-5P', 12).join(' '), 'D G C F Bb Eb Ab Db Gb Cb Fb Bbb')
  },
  'with offset': function () {
    assert.deepEqual(cycle('C', '5P', 5, 2), ['D', 'A', 'E', 'B', 'F#'])
  }
}).export(module)
