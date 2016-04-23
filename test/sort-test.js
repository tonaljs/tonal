/* global describe it */
var assert = require('assert')
var sort = require('..').sort

describe('sort lists -', function () {
  it('sort pitch classes', function () {
    assert.deepEqual(sort(true, 'A G F C E'), [ 'C', 'E', 'F', 'G', 'A' ])
    assert.deepEqual(sort(false, 'A G F C E'), [ 'A', 'G', 'F', 'E', 'C' ])
  })
  describe('ascending', function () {
    it('notes', function () {
      assert.deepEqual(sort(true, 'c2 d5 f0 gb g#2 db-1 c# ab2 h6 b3'),
        [null, 'C#', 'Gb', 'Db-1', 'F0', 'C2', 'G#2', 'Ab2', 'B3', 'D5'])
    })
    it('intervals', function () {
      assert.deepEqual(sort(true, 'P1 M2 9M 5P 3M 3m 4A 4P blh'),
        [null, '1P', '2M', '3m', '3M', '4P', '4A', '5P', '9M'])
    })
    it('descending intervals', function () {
      assert.deepEqual(sort(true, 'P1 M-2 M-3 -4P -5P'),
        [ '-5P', '-4P', '-3M', '-2M', '1P' ])
    })
    it('true and null are equvalent', function () {
      assert.deepEqual(sort(true, 'c2 d5 f1 g#2 db1 ab2 h6 b3'),
        sort(null, 'c2 d5 f1 g#2 db1 ab2 h6 b3'))
    })
  })
  describe('if comparator is false, it sorts by descending pitch', function () {
    it('sort notes descending', function () {
      assert.deepEqual(sort(false, 'c2 d5 f1 g#2 db1 ab2 h6 b3'),
        [ 'D5', 'B3', 'G#2', 'Ab2', 'C2', 'F1', 'Db1', null ])
    })
  })
  describe('its currified', function () {
    it('returns a function if only on parameter', function () {
      var desc = sort(false)
      assert(typeof desc === 'function')
      assert.deepEqual(desc('C D E F G'), [ 'G', 'F', 'E', 'D', 'C' ])
    })
  })
})
