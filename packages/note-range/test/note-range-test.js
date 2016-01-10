/* global describe it */
var assert = require('assert')
var range = require('..')

describe('scale-range', function () {
  describe('scale type', function () {
    it('scale nulls means chromatic', function () {
      assert.deepEqual(range(null, 'A2', 'C#3'),
        [ 'A2', 'Bb2', 'B2', 'C3', 'C#3' ])
    })
  })
  describe('creates a range from intervals', function () {
    it('from an interval scale, tonic and length', function () {
      assert.deepEqual(range('1 3 5', 'A2', 7),
      ['A2', 'C#3', 'E3', 'A3', 'C#4', 'E4', 'A4'])
    })
    it('from an interval scale, tonic and limit', function () {
      assert.deepEqual(range('1 3 5', 'A2', 'C4'), ['A2', 'C#3', 'E3', 'A3'])
    })
  })
  describe.skip('creates a range from notes', function () {
    it('from note scale, lower and length', function () {
      assert.deepEqual(range('E F G C D', 'Db2', 7),
        ['D2', 'E2', 'F2', 'G2', 'C3', 'D3', 'E3'])
    })
  })
})
