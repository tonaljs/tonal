var vows = require('vows')
var assert = require('assert')
var props = require('../../lib/pitch/props')
var _ = require('lodash')

function pluck (name, pitchs) {
  return _.pluck(pitchs.split(' ').map(props), name)
}

vows.describe('pitch/props').addBatch({
  'pitch props cached and coerced': function () {
    assert.deepEqual(props('A##2'), props('A##2'), 'props the same pitch is equal data')
    assert.deepEqual(props(props('Db5')), props('Db5'), 'props a pitch props is legal ;-)')
    assert(props('Ab3') === props('Ab3'), 'pitch props should be cached')
  },
  'pitch props name': function () {
    assert.deepEqual(pluck('name', 'C#2 bbb5 Cx3'),
      ['C#2', 'bbb5', 'Cx3'])
  },
  'pitch props pitch class': function () {
    assert.deepEqual(pluck('pitchClass', 'C#2 bbb5 Cx3'),
      ['C#', 'Bbb', 'C##'])
  },
  'pitch props letter': function () {
    assert.deepEqual(pluck('letter', 'C#2 bbb5 ex3'),
      ['C', 'B', 'E'])
  },
  'pitch props accidentals': function () {
    assert.deepEqual(pluck('acc', 'd C#2 Bb5 bbb5 Cx2 cxx3'),
      ['', '#', 'b', 'bb', '##', '####'])
  },
  'pitch props midi': function () {
    assert.deepEqual(pluck('midi', 'C D E F G A B'),
      [60, 62, 64, 65, 67, 69, 71])
  },
  'pitch props alterations': function () {
    assert.deepEqual(pluck('alter', 'd C#2 Bb5 bbb5 Cx2 cxx3'),
      [0, 1, -1, -2, 2, 4])
  },
  'pitch props chroma': function () {
    assert.deepEqual(pluck('chroma', 'C C# D D# E F F# G G# A A# B B#'),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    assert.deepEqual(pluck('chroma', 'Cb C Db D Eb E F Gb G Ab A Bb B'),
      [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    // edge cases
    assert.equal(props('Bb').chroma, 10)
    assert.equal(props('Bbb').chroma, 9)
    assert.equal(props('bbb').chroma, 9)
  },
  'invalid pitch propss': function () {
    assert.equal(props('blah'), null)
    assert.equal(props('m'), null)
    assert.equal(props('Cmaj7'), null)
  }
}).export(module)
