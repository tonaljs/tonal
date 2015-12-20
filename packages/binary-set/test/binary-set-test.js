/* global describe it */
var assert = require('assert')
var binarySet = require('..')

describe('binary-set', function () {
  describe('toBinary', function () {
    it('get binary set', function () {
      assert.equal(binarySet.toBinary('C D e f#').length, 12)
      assert.equal(binarySet.toBinary('C D e f#'), '101010100000')
      assert.equal(binarySet.toBinary('c d e f g a b'), '101011010101')
      assert.equal(binarySet.toBinary('c d e f g a b c d e f'), '101011010101')
    })
    it('compare binary sets', function () {
      assert.equal(binarySet.toBinary('c d eb f g a bb'), binarySet.toBinary('d e f g a b c'))
    })
    it('strange notes binary set', function () {
      assert.equal(binarySet.toBinary('C2 D1'), binarySet.toBinary('c2 d2'))
    })
  })
  describe('fromBinary', function () {
    it('12 digit binary number', function () {
      assert.deepEqual(binarySet.fromBinary('101000000000', 'E'), [ 'E', 'F#' ])
      assert.deepEqual(binarySet.fromBinary('101011010101', 'C'), ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    })
    it('decimal number', function () {
      assert.deepEqual(binarySet.fromBinary(2773, 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.deepEqual(binarySet.fromBinary(2773, false), ['1P', '2M', '3M', '4', '5', '6M', '7M'])
      assert.deepEqual(binarySet.fromBinary(3434, 'B'), [ 'B', 'C', 'D', 'E', 'F', 'G', 'A' ])
    })
    it('test classical modes', function () {
      var modes = 'C D E F G A B'.split(' ').map(function (t, i, a) {
        return a.slice(i, a.length).concat(a.slice(0, i))
      })
      var fromBinaries = modes.map(function (set) {
        return binarySet.fromBinary(binarySet.toBinary(set), set[0])
      })
      assert.deepEqual(fromBinaries, modes)
    })
    it('partial', function () {
      var major = binarySet.fromBinary(2773)
      assert.deepEqual(major('D'), [ 'D', 'E', 'F#', 'G', 'A', 'B', 'C#' ])
    })
    it('invalid params', function () {
      assert.deepEqual(binarySet.fromBinary(null, 'E'), [ ])
      assert.deepEqual(binarySet.fromBinary(2773, 'blah'), [ null, null, null, null, null, null, null ])
    })
  })
})
