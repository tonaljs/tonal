/* global describe it */
var assert = require('assert')
var transpose = require('..')

describe('note-transposer', function () {
  describe('simple transposition', function () {
    it('transpose pitches', function () {
      assert.equal(transpose('C4', '8P'), 'C5')
      assert.equal(transpose('C4', '2M'), 'D4')
      assert.equal(transpose('C4', '4P'), 'F4')
      assert.equal(transpose('C2', '5P'), 'G2')
      assert.equal(transpose('D5', '3M'), 'F#5')
    })
    it('transpose edge cases', function () {
      assert.equal(transpose('Gb4', '4P'), 'Cb5')
      assert.equal(transpose('F4', '-5P'), 'Bb3')
      assert.equal(transpose('E4', '2M'), 'F#4')
      assert.equal(transpose('F4', '-2M'), 'Eb4')
      assert.equal(transpose('B#2', '5P'), 'F##3')
    })
    it('transpose pitch classes', function () {
      assert.equal(transpose('C', '3m'), 'Eb')
      assert.equal(transpose('C#', '3m'), 'E')
      assert.equal(transpose('D', '3M'), 'F#')
    })
  })

  describe('partial applied', function () {
    it('transpose from a list of intervals', function () {
      var intervals = '1P 2M 3M 4P 5P 6M 7M 8P'.split(' ')
      assert.deepEqual(intervals.map(transpose('C')),
      ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'])
      assert.deepEqual(intervals.map(transpose('C#6')),
      ['C#6', 'D#6', 'E#6', 'F#6', 'G#6', 'A#6', 'B#6', 'C#7'])
      assert.deepEqual(intervals.map(transpose('Db6')),
      ['Db6', 'Eb6', 'F6', 'Gb6', 'Ab6', 'Bb6', 'C7', 'Db7'])
      assert.deepEqual(intervals.map(transpose('F2')),
      ['F2', 'G2', 'A2', 'Bb2', 'C3', 'D3', 'E3', 'F3'])
    })

    it('from a list of descending intervals', function () {
      var intervals = '-1P -2M -3M -4P -5P -6M -7M -8P'.split(' ')
      assert.deepEqual(intervals.map(transpose('C4')),
      ['C4', 'Bb3', 'Ab3', 'G3', 'F3', 'Eb3', 'Db3', 'C3'])
      assert.deepEqual(intervals.map(transpose('C')),
      ['C', 'Bb', 'Ab', 'G', 'F', 'Eb', 'Db', 'C'])
    })

    it('transpose pitches by an interval', function () {
      var notes = 'C4 D4 E4 F4 G4 A4 B4'.split(' ')
      assert.deepEqual(notes.map(transpose('9M')),
      ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6'])
      assert.deepEqual(notes.map(transpose('-9M')),
      ['Bb2', 'C3', 'D3', 'Eb3', 'F3', 'G3', 'A3'])
    })

    it('no params', function () {
      assert.equal(transpose(), null)
    })
  })

  it('edge cases', function () {
    var tr = function (i) { return i.split(' ').map(transpose('C2')) }
    assert.deepEqual(tr('1d 1P 1A'), ['Cb2', 'C2', 'C#2'])
    assert.deepEqual(tr('-1d -1P -1A'), ['C#2', 'C2', 'Cb2'])
    assert.deepEqual(tr('2d 2m 2M 2A'), [ 'Dbb2', 'Db2', 'D2', 'D#2' ])
    assert.deepEqual(tr('-2d -2m -2M -2A'), [ 'B#1', 'B1', 'Bb1', 'Bbb1' ])
    assert.deepEqual(tr('5P -5P 5A -5A'), ['G2', 'F1', 'G#2', 'Fb1'])
    assert.deepEqual(tr('6M -6M 6m -6m'), ['A2', 'Eb1', 'Ab2', 'E1'])
  })

  it('irrelevant orden of parameters', function () {
    assert.equal(transpose('2M', 'E2'), 'F#2')
    assert.equal(transpose('E2', '2M'), 'F#2')
  })

  it('interval false', function () {
    assert.equal(transpose(false, 'e2'), 'E2')
  })

  it('curry', function () {
    assert.deepEqual('1 2 3b 4 5 6 7b'.split(' ').map(transpose('C2')),
    ['C2', 'D2', 'Eb2', 'F2', 'G2', 'A2', 'Bb2'])
    assert.deepEqual('C2 D2 E2 F2 G2 A2 B2'.split(' ').map(transpose('2M')),
    ['D2', 'E2', 'F#2', 'G2', 'A2', 'B2', 'C#3'])
  })

  it('invalid values', function () {
    assert.equal(transpose(null, 'C2'), null)
    assert.equal(transpose('blah', 'C3'), null)
  })

  it('array notation', function () {
    assert.deepEqual(transpose([0, 2, 0], [2, -1]), [ 2, 1, 0 ])
    assert.deepEqual(transpose('C2', [-12, 7]), 'Dbb2')
    assert.deepEqual(transpose([0, 2, 0], '2M'), 'D2')
    assert.deepEqual(transpose('C2', [2, -1]), 'D2')
    assert.deepEqual(transpose('C2')([2, -1]), 'D2')
  })
})
