/* global describe it */
var assert = require('assert')
var fromProps = require('../array/from-props')

describe('music-notation/array/from-props', function () {
  it('create array from pitch class props [step, alteration]', function () {
    assert.deepEqual(fromProps(0, 0), [0])
    assert.deepEqual(fromProps(1, 0), [2])
    assert.deepEqual(fromProps(0, 1), [7])
    assert.deepEqual(fromProps(0, -1), [-7])
  })

  it('creates array from intervals props [step, alteration, octave]', function () {
    assert.deepEqual(fromProps(0, 0, 1), [0, 1])
    assert.deepEqual(fromProps(3, 0, 1), [-1, 2])
    assert.deepEqual(fromProps(3, 1, 1), [6, -2])
    assert.deepEqual(fromProps(0, -1, 0), [-7, 4])
  })

  it('create array from note props [step, alteration, octave, duration]', function () {
    assert.deepEqual(fromProps(0, 0, 2, null), [0, 2, null])
    assert.deepEqual(fromProps(0, 0, 4, null), [0, 4, null])
  })
})
