var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/note/parse')
var _ = require('lodash')

function pluck (name, notes) {
  return _.pluck(notes.split(' ').map(parse), name)
}

vows.describe('note/parse').addBatch({
  'parsed note': function () {
    assert.deepEqual(pluck('note', 'C#2 bbb5 Cx3'),
      ['C#2', 'bbb5', 'Cx3'])
  },
  'parsed accidentals': function () {
    assert.deepEqual(pluck('acc', 'd C#2 Bb5 bbb5 Cx2 cxx3'),
      ['', '#', 'b', 'bb', '##', '####'])
  },
  'parsed alterations': function () {
    assert.deepEqual(pluck('alter', 'd C#2 Bb5 bbb5 Cx2 cxx3'),
      [0, 1, -1, -2, 2, 4])
  },
  'parsed pitch class': function () {
    assert.deepEqual(pluck('pc', 'C C# D D# E F F# G G# A A# B B#'),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    assert.deepEqual(pluck('pc', 'Cb C Db D Eb E F Gb G Ab A Bb B'),
      [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    // edge cases
    assert.equal(parse('Bb').pc, 10)
    assert.equal(parse('Bbb').pc, 9)
    assert.equal(parse('bbb').pc, 9)
  },
  'invalid parse notes': function () {
    assert.equal(parse('blah'), null)
    assert.equal(parse('m'), null)
    assert.equal(parse('Cmaj7'), null)
  }
}).export(module)
