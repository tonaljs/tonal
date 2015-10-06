var vows = require('vows')
var assert = require('assert')
var chroma = require('../../lib/pitch/chroma')

vows.describe('pitch/chroma').addBatch({
  'pitch chroma chroma': function () {
    assert.deepEqual('C C# D D# E F F# G G# A A# B B#'.split(' ').map(chroma),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0])
    assert.deepEqual('Cb C Db D Eb E F Gb G Ab A Bb B'.split(' ').map(chroma),
      [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  },
  'edge cases': function () {
    assert.equal(chroma('Bb'), 10)
    assert.equal(chroma('Bbb'), 9)
    assert.equal(chroma('bbb'), 9)
    assert.equal(chroma('B#'), 0)
    assert.equal(chroma('B##'), 1)
  },
  'invalid pitch chromas': function () {
    assert.equal(chroma('blah'), null)
    assert.equal(chroma('m'), null)
    assert.equal(chroma('Cmaj7'), null)
  }
}).export(module)
