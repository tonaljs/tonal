/* global describe it */
var assert = require('assert')
var chord = require('..')

describe('chord-dictionary', function () {
  it('get chord by name and tonic', function () {
    assert.deepEqual(chord('Abm7b5'), [ 'Ab', 'Cb', 'Ebb', 'Gb' ])
    assert.deepEqual(chord('m7b5', 'Ab'), [ 'Ab', 'Cb', 'Ebb', 'Gb' ])
    assert.deepEqual(chord('m7b5')('Ab'), [ 'Ab', 'Cb', 'Ebb', 'Gb' ])
  })
  it('names', function () {
    assert.equal(chord.names().length, 108)
    assert.equal(chord.names(true).length, 223)
  })
  describe('chord data', function () {
    it('chord data object', function () {
      assert.deepEqual(chord.props('Maj7'), {
        name: 'Maj7', aliases: [ 'maj7', 'M7' ],
        intervals: ['1', '3', '5', '7'],
        steps: [[ 0, 0 ], [ 4, -2 ], [ 1, 0 ], [ 5, -2 ]],
        binary: '100010010001', decimal: 2193
      })
    })
    it('aliases', function () {
      assert.deepEqual(chord.props('M7'), chord.props('Maj7'))
    })
    it('binary and decimal', function () {
      assert.deepEqual(chord.props('100010010001'), chord.props('Maj7'))
      assert.deepEqual(chord.props(2193), chord.props('Maj7'))
      assert.deepEqual(chord.props('2193'), chord.props('Maj7'))
    })
  })
})
