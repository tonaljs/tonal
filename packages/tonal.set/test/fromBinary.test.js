/* global describe it */
var assert = require('assert')
var fromBinary = require('../lib/fromBinary')
var binary = require('../lib/binary')

describe('set.fromBinary', function () {
  it('12 digit binary number', function () {
    assert.deepEqual(fromBinary('101000000000', 'E'), [ 'E', 'F#' ])
    assert.deepEqual(fromBinary('101011010101', 'C'), ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
  })
  it('decimal number', function () {
    assert.deepEqual(fromBinary(2773, 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    assert.deepEqual(fromBinary(2773, false), ['1P', '2M', '3M', '4', '5', '6M', '7M'])
    assert.deepEqual(fromBinary(3434, 'B'), [ 'B', 'C', 'D', 'E', 'F', 'G', 'A' ])
  })
  it('test classical modes', function () {
    var modes = 'C D E F G A B'.split(' ').map(function (t, i, a) {
      return a.slice(i, a.length).concat(a.slice(0, i))
    })
    var fromBinaries = modes.map(function (set) {
      return fromBinary(binary(set), set[0])
    })
    assert.deepEqual(fromBinaries, modes)
  })
  it('partial', function () {
    var major = fromBinary(2773)
    assert.deepEqual(major('D'), [ 'D', 'E', 'F#', 'G', 'A', 'B', 'C#' ])
  })
  it('invalid params', function () {
    assert.deepEqual(fromBinary(null, 'E'), [ ])
    assert.deepEqual(fromBinary(2773, 'blah'), [ null, null, null, null, null, null, null ])
  })
})
