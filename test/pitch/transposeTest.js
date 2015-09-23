var vows = require('vows')
var assert = require('assert')
var transpose = require('../../lib/pitch/transpose')

vows.describe('pitch/transpose').addBatch({
  'transpose edge cases': function () {
    assert.equal(transpose('Gb', '4P'), 'Cb5')
    assert.equal(transpose('F4', '-5P'), 'Bb3')
    assert.equal(transpose('E4', '2M'), 'F#4')
    assert.equal(transpose('F4', '-2M'), 'Eb4')
    assert.equal(transpose('B#2', '5P'), 'F##3')
  },
  'transpose simple intervals': function () {
    var intervals = '1P 2M 3M 4P 5P 6M 7M 8P'.split(' ')
    assert.deepEqual(intervals.map(transpose('C')),
      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'])
    assert.deepEqual(intervals.map(transpose('C#6')),
      ['C#6', 'D#6', 'E#6', 'F#6', 'G#6', 'A#6', 'B#6', 'C#7'])
    assert.deepEqual(intervals.map(transpose('Db6')),
      ['Db6', 'Eb6', 'F6', 'Gb6', 'Ab6', 'Bb6', 'C7', 'Db7'])
    assert.deepEqual(intervals.map(transpose('F2')),
      ['F2', 'G2', 'A2', 'Bb2', 'C3', 'D3', 'E3', 'F3'])
  },
  'transpose simple descending intervals': function () {
    var intervals = '-1P -2M -3M -4P -5P -6M -7M -8P'.split(' ')
    assert.deepEqual(intervals.map(transpose('C4')),
      ['C4', 'Bb3', 'Ab3', 'G3', 'F3', 'Eb3', 'Db3', 'C3'])
  },
  'transpose notes': function () {
    var notes = 'C4 D4 E4 F4 G4 A4 B4'.split(' ')
    assert.deepEqual(notes.map(transpose('9M')),
      ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6'])
    assert.deepEqual(notes.map(transpose('-9M')),
      ['Bb2', 'C3', 'D3', 'Eb3', 'F3', 'G3', 'A3'])
  }
}).export(module)
