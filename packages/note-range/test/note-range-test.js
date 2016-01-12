/* global describe it */
var assert = require('assert')
var range = require('..')

describe('scale-range', function () {
  describe('chromatic scale with null scale parameter', function () {
    it('ascending range', function () {
      assert.deepEqual(range(null, 'A2', 'C#3'),
        [ 'A2', 'Bb2', 'B2', 'C3', 'C#3' ])
    })
    it('sequence length', function () {
      assert.deepEqual(range(null, 'A4', 6),
        [ 'A4', 'Bb4', 'B4', 'C5', 'C#5', 'D5' ])
    })
    it.skip('descending range', function () {
      assert.deepEqual(range(null, 'A4', 'D4'))
    })
  })
  describe('intervals scale', function () {
    it('range length', function () {
      assert.deepEqual(range('1 3 5', 'A2', 7),
      ['A2', 'C#3', 'E3', 'A3', 'C#4', 'E4', 'A4'])
    })
    it('ascending range', function () {
      assert.deepEqual(range('1 3 5', 'A2', 'C4'), ['A2', 'C#3', 'E3', 'A3'])
    })
  })
  describe.skip('notes scale', function () {
    it('range length', function () {
      assert.deepEqual(range('E F G C D', 'Db2', 7),
        ['D2', 'E2', 'F2', 'G2', 'C3', 'D3', 'E3'])
    })
  })
})
