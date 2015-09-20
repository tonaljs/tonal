var vows = require('vows')
var assert = require('assert')
var transpose = require('../../lib/fifths/transpose')

var ASC = [0, 1, 2, 3, 4, 5, 6, 7, 8]
var DESC = [0, -1, -2, -3, -4, -5, -6, -7, -8]
var pitches = function (base, nums) {
  return nums.map(function (num) {
    return transpose(base, num)
  })
}

vows.describe('fifths/transpose').addBatch({
  'transpose positive number': function () {
    assert.deepEqual(pitches('F', ASC), ['F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'])
    assert.deepEqual(pitches('E4', ASC), ['E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'])
    assert.deepEqual(pitches('F#', ASC), ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#', 'F##', 'C##'])
    assert.deepEqual(pitches('D#', ASC), ['D#', 'A#', 'E#', 'B#', 'F##', 'C##', 'G##', 'D##', 'A##'])
    assert.deepEqual(pitches('Eb', ASC), ['Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B'])
    assert.deepEqual(pitches('Abb', ASC), ['Abb', 'Ebb', 'Bbb', 'Fb', 'Cb', 'Gb', 'Db', 'Ab', 'Eb'])
  },
  'transpose negative number': function () {
    assert.deepEqual(pitches('C', DESC), ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fbb'])
    assert.deepEqual(pitches('Bb5', DESC), ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb', 'Bbb', 'Ebb'])
    assert.deepEqual(pitches('D#', DESC), ['D#', 'G#', 'C#', 'F#', 'B', 'E', 'A', 'D', 'G'])
  }
}).export(module)
