var vows = require('vows')
var assert = require('assert')
var parse = require('../../lib/note/parse')
var _ = require('lodash')

function pluck (name, notes) {
  return _.pluck(notes.split(' ').map(parse), name)
}

vows.describe('note/parse').addBatch({
  'parse note cached and coerced': function () {
    assert.deepEqual(parse('A##2'), parse('A##2'), 'parse the same note is equal data')
    assert.deepEqual(parse(parse('Db5')), parse('Db5'), 'parse a parsed note is legal ;-)')
    assert(parse('Ab3') === parse('Ab3'), 'parse note should be cached')
  },
  'parsed note name': function () {
    assert.deepEqual(pluck('name', 'C#2 bbb5 Cx3'),
      ['C#2', 'bbb5', 'Cx3'])
  },
  'parsed note pitch class': function () {
    assert.deepEqual(pluck('pitchClass', 'C#2 bbb5 Cx3'),
      ['C#', 'Bbb', 'C##'])
  },
  'parsed note letter': function () {
    assert.deepEqual(pluck('letter', 'C#2 bbb5 ex3'),
      ['C', 'B', 'E'])
  },
  'parsed note accidentals': function () {
    assert.deepEqual(pluck('acc', 'd C#2 Bb5 bbb5 Cx2 cxx3'),
      ['', '#', 'b', 'bb', '##', '####'])
  },
  'parsed note midi': function () {
    assert.deepEqual(pluck('midi', 'C D E F G A B'),
      [60, 62, 64, 65, 67, 69, 71])
  },
  'parsed note alterations': function () {
    assert.deepEqual(pluck('alter', 'd C#2 Bb5 bbb5 Cx2 cxx3'),
      [0, 1, -1, -2, 2, 4])
  },
  'parsed note chroma': function () {
    assert.deepEqual(pluck('chroma', 'C C# D D# E F F# G G# A A# B B#'),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    assert.deepEqual(pluck('chroma', 'Cb C Db D Eb E F Gb G Ab A Bb B'),
      [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    // edge cases
    assert.equal(parse('Bb').chroma, 10)
    assert.equal(parse('Bbb').chroma, 9)
    assert.equal(parse('bbb').chroma, 9)
  },
  'invalid parse notes': function () {
    assert.equal(parse('blah'), null)
    assert.equal(parse('m'), null)
    assert.equal(parse('Cmaj7'), null)
  }
}).export(module)
