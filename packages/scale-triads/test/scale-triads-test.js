/* global describe it */
var assert = require('assert')
var triads = require('..')

describe('scale-triads', function () {
  it('first test', function () {
    var major = triads('1 2 3 4 5 6 7', 4)
    assert.deepEqual(major('II', 'C'), ['C', 'Eb', 'G', 'Bb'])
    assert.deepEqual(major('V', 'C'), [ 'C', 'E', 'G', 'Bb' ])
    assert.deepEqual(major('IV', 'C'), [ 'C', 'E', 'G', 'B' ])
  })
})
