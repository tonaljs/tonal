var vows = require('vows')
var assert = require('assert')
var pc = require('../../lib/note/pitch-class')

vows.describe('Note').addBatch({
  'note pitch class': function () {
    var sharps = 'C C# D D# E F F# G G# A A# B B#'.split(' ').map(pc)
    assert.deepEqual(sharps, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    var flats = 'Cb C Db D Eb E F Gb G Ab A Bb B'.split(' ').map(pc)
    assert.deepEqual(flats, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  },
  'edge cases': function () {
    assert.equal(pc('Bb'), 10)
    assert.equal(pc('Bbb'), 9)
    assert.equal(pc('bbb'), 9)
  }
}).export(module)
