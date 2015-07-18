var vows = require('vows')
var assert = require('assert')
var cycle = require('../cycle-of-fifths')

vows.describe('Cycle of fifths').addBatch({
  'positive notes': function () {
    var notes = '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16'.split(' ').map(cycle)
    assert.equal(notes.join(' '), 'C G D A E B F# C# G# D# A# F C G D A E')
  },
  'negative notes': function () {
    var notes = '0 -1 -2 -3 -4 -5 -6 -7 -8 -9 -10 -11 -12 -13 -14 -15 -16'.split(' ').map(cycle)
    assert.equal(notes.join(' '), 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb C F Bb Eb Ab')
  }
}).export(module)
