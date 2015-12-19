/* global describe it */
var assert = require('assert')
var chords = require('..').dictionary

describe('music-chord/dictionary', function () {
  it('names', function () {
    assert.equal(chords.names().length, 108)
  })

  describe('chords data', function () {
    it('chord data object', function () {
      assert.deepEqual(chords.data['Maj7'], {
        name: 'Maj7', aliases: [ 'maj7', 'M7' ],
        intervals: ['1', '3', '5', '7'],
        steps: [[ 0, 0 ], [ 4, -2 ], [ 1, 0 ], [ 5, -2 ]],
        binary: '100010010001', decimal: 2193
      })
    })
    it('aliases', function () {
      assert.deepEqual(chords.data['M7'], chords.data['Maj7'])
    })
    it('binary and decimal', function () {
      assert.deepEqual(chords.data['100010010001'], chords.data['Maj7'])
      assert.deepEqual(chords.data[2193], chords.data['Maj7'])
      assert.deepEqual(chords.data['2193'], chords.data['Maj7'])
    })
  })
})
