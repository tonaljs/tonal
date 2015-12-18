/* global describe it */
var assert = require('assert')
var note = require('../note/parse')
var interval = require('../interval/parse')
var props = require('../lib/array-props')

function prop (i, str, parser) {
  return str.split(' ').map(parser).map(props).map(function (e) { return e[i] })
}

describe('notation.props', function () {
  it('note letters', function () {
    assert.deepEqual(prop(0, 'C D E F G A B', note), [0, 1, 2, 3, 4, 5, 6])
    assert.deepEqual(prop(0, 'C2 D2 E2 F2 G2 A2 B2', note), [0, 1, 2, 3, 4, 5, 6])
    assert.deepEqual(prop(0, 'C23 D#3 E#3 F#3 G#3 A#3 B#3', note), [0, 1, 2, 3, 4, 5, 6])
    assert.deepEqual(prop(0, 'Cb5 Db5 Eb5 Fb5 Gb5 Ab5 Bb5', note), [0, 1, 2, 3, 4, 5, 6])
  })
  it('note alterations', function () {
    assert.deepEqual(prop(1, 'C D E F G A B', note), [0, 0, 0, 0, 0, 0, 0])
    assert.deepEqual(prop(1, 'C# D# E# F# G# A# B#', note), [1, 1, 1, 1, 1, 1, 1])
    assert.deepEqual(prop(1, 'C## D## E## F## G## A## B##', note), [2, 2, 2, 2, 2, 2, 2])
    assert.deepEqual(prop(1, 'Cb Db Eb Fb Gb Ab Bb', note), [-1, -1, -1, -1, -1, -1, -1])
    assert.deepEqual(prop(1, 'Cbb Dbb Ebb Fbb Gbb Abb Bbb', note), [-2, -2, -2, -2, -2, -2, -2])
  })
  it('note octave', function () {
    assert.deepEqual(prop(2, 'C D E F G A B', note), [null, null, null, null, null, null, null])
    assert.deepEqual(prop(2, 'C1 D1 E1 F1 G1 A1 B1', note), [1, 1, 1, 1, 1, 1, 1])
    assert.deepEqual(prop(2, 'C2 D2 E2 F2 G2 A2 B2', note), [2, 2, 2, 2, 2, 2, 2])
    assert.deepEqual(prop(2, 'C-1 D-1 E-1 F-1 G-1 A-1 B-1', note), [-1, -1, -1, -1, -1, -1, -1])
  })
  it('interval numbers', function () {
    assert.deepEqual(prop(0, '1 2 3 4 5 6 7', interval), [0, 1, 2, 3, 4, 5, 6])
    assert.deepEqual(prop(0, '8 9 10 11 12 13 14', interval), [0, 1, 2, 3, 4, 5, 6])
    assert.deepEqual(prop(0, '15 16 17 18 19 20 21', interval), [0, 1, 2, 3, 4, 5, 6])
  })
  it('interval alteration', function () {
    assert.deepEqual(prop(1, '1P 2M 3M 4P 5P 6M 7M', interval), [0, 0, 0, 0, 0, 0, 0])
    assert.deepEqual(prop(1, '1d 2m 3m 4d 5d 6m 7m', interval), [-1, -1, -1, -1, -1, -1, -1])
    assert.deepEqual(prop(1, '1A 2A 3A 4A 5A 6A 7A', interval), [1, 1, 1, 1, 1, 1, 1])
  })
  it('interval octave', function () {
    assert.deepEqual(prop(2, '1 2 3 4 5 6 7', interval), [0, 0, 0, 0, 0, 0, 0])
    assert.deepEqual(prop(2, '8 9 10 11 12 13 14', interval), [1, 1, 1, 1, 1, 1, 1])
    assert.deepEqual(prop(2, '15 16 17 18 19 20 21', interval), [2, 2, 2, 2, 2, 2, 2])
  })
  it('invalid pitches', function () {
    assert.equal(props(), null)
    assert.equal(props(null), null)
    assert.equal(props('C2'), null)
    assert.equal(props('blah'), null)
  })
})
