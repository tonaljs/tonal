var vows = require('vows')
var assert = require('assert')
var transpose = require('../../lib/interval/transpose')

vows.describe('Interval').addBatch({
  'transpose edge cases': function () {
    assert.equal(transpose('M2', 'E4'), 'F#4')
    assert.equal(transpose('M-2', 'F4'), 'Eb4')
  },
  'transpose simple intervals': function () {
    var intervals = 'P1 M2 M3 P4 P5 M6 M7 P8'.split(' ')
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
    var intervals = 'P-1 M-2 M-3 P-4 P-5 M-6 M-7 P-8'.split(' ')
    assert.deepEqual(intervals.map(transpose('C4')),
      ['C4', 'Bb3', 'Ab3', 'G3', 'F3', 'Eb3', 'Db3', 'C3'])
  },
  'transpose notes': function () {
    var notes = 'C D E F G A B'.split(' ')
    assert.deepEqual(notes.map(transpose('M9')),
      ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6'])
    assert.deepEqual(notes.map(transpose('M-9')),
      ['Bb3', 'C4', 'D4', 'Eb4', 'F4', 'G4', 'A4'])
  }
}).export(module)
