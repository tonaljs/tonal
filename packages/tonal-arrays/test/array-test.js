/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')

describe('tonal-arrays', function () {
  describe('harmonizer', function () {
    it('creates an harmonizer function', function () {
      var maj7 = _.harmonizer('1P 3M 5P 7M')
      assert.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
    })
  })
  describe('harmonize', function () {
    var harmonize = _.harmonize
    it('filter nulls', function () {
      assert.deepEqual(harmonize('C blah D', '7m'), [ 'Bb', 'C' ])
      assert.deepEqual(harmonize(null, '7m'), [])
    })
    it('null or false returns the pitches', function () {
      assert.deepEqual(harmonize('c d e', null), [ 'C', 'D', 'E' ])
    })
    it('harmonizes intervals by tonic', function () {
      assert.deepEqual(harmonize('1P 3M 5P', 'A4'),
        [ 'A4', 'C#5', 'E5' ])
    })
    it('harmonizes notes by interval', function () {
      assert.deepEqual(harmonize('C E G', 'M3'),
        [ 'E', 'G#', 'B' ])
    })
  })
  describe('map', function () {
    function up (s) { return s.toUpperCase() }
    it('splits list source', function () {
      assert.deepEqual(_.map(up, 'a bb cx'),
        [ 'A', 'BB', 'CX' ])
    })
    it('can be partially applied', function () {
      var ups = _.map(up)
      assert.deepEqual(ups('a bb cx'),
        [ 'A', 'BB', 'CX' ])
    })
  })
  describe('filter', function () {
    it('filter lists', function () {
      function isUpLetter (s) { return 'CDEFGAB'.indexOf(s[0]) !== -1 }
      assert.deepEqual(_.filter(isUpLetter, 'C d f4 A4 M3'),
        [ 'C', 'A4' ])
    })
  })
  describe('shuffle', function () {
    it('shuffles an array', function () {
      var s = _.shuffle('A B C D')
      assert.equal(s.length, 4)
      assert.notEqual(s.indexOf('A'), -1)
      assert.notEqual(s.indexOf('B'), -1)
      assert.notEqual(s.indexOf('C'), -1)
      assert.notEqual(s.indexOf('D'), -1)
    })
  })
})
