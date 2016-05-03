/* global describe it */
var assert = require('assert')
var scales = require('..')

describe('tonal-scales', function () {
  describe('scaleRange', function () {
    var range = scales.scaleRange
    it('accepts a list of pitch classes', function () {
      assert.deepEqual(range('C D E', 'C2', 'C4'),
        [ 'C2', 'D2', 'E2', 'C3', 'D3', 'E3', 'C4' ])
    })
    it('accepts a scale name', function () {
      assert.deepEqual(range('C bebop', 'C3', 'C2'),
        [ 'C3', 'B2', 'Bb2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ])
    })
    it('rejects a scale name witout tonic', function () {
      assert.deepEqual(range('bebop', 'C3', 'C2'), [])
    })
  })
})
