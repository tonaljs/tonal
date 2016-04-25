/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')

describe('intervals', function () {
  describe('isIntervalStr', function () {
    it('test if its interval string', function () {
      assert.equal(_.isIntervalStr('M3'), true, 'interval')
      assert.equal(_.isIntervalStr('C'), false, 'pitch class')
      assert.equal(_.isIntervalStr('F#2'), false, 'note name')
    })
  })
  describe('simplify', function () {
    it('simplifies intervals', function () {
      var simples = _.map(_.simplify)
      assert.deepEqual(simples('1P 2M 3M 4P 5P 6M 7M'),
        [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
      assert.deepEqual(simples('8A 9A 10A 11A 12A 13A 14A'),
        [ '1A', '2A', '3A', '4A', '5A', '6A', '7A' ])
      assert.deepEqual(simples('15d 16m 17m 18d 19d 20m 21m'),
        [ '1d', '2m', '3m', '4d', '5d', '6m', '7m' ])
      assert.deepEqual(simples('-15d -16m -17m -18d -19d -20m -21m'),
        [ '-1d', '-2m', '-3m', '-4d', '-5d', '-6m', '-7m' ])
    })
  })
  describe('simple', function () {
    it('get simple from interval', function () {
      var simples = _.map(_.simpleNum)
      assert.deepEqual(simples('1P 2M 3M 4P 5P 6M 7M'),
      [ 1, 2, 3, 4, 5, 6, 7 ])
      assert.deepEqual(simples('8A 9A 10A 11A 12A 13A 14A'),
      [ 1, 2, 3, 4, 5, 6, 7 ])
      assert.deepEqual(simples('15d 16m 17m 18d 19d 20m 21m'),
      [ 1, 2, 3, 4, 5, 6, 7 ])
    })
  })
  describe('number', function () {
    var numbers = _.map(_.number)
    it('get number from intervals', function () {
      assert.deepEqual(numbers('1P 3M 6m 9M 11P'),
      [1, 3, 6, 9, 11])
    })
  })
  describe('quality', function () {
    var qualities = _.map(_.quality)
    it('get quality of intervals', function () {
      assert.deepEqual(qualities('2dd 2d 2m 2M 2A 2AA'),
      [ 'dd', 'd', 'm', 'M', 'A', 'AA' ])
      assert.deepEqual(qualities('4dd 4d 4P 4A 4AA'),
      [ 'dd', 'd', 'P', 'A', 'AA' ])
      assert.deepEqual(qualities('8P 9M 10M 11P 12P 13M 14M'),
      [ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
      assert.deepEqual(qualities('15A 16A 17A 18A 19A 20A 21A'),
      [ 'A', 'A', 'A', 'A', 'A', 'A', 'A' ])
    })
  })
  describe('semitones', function () {
    var semitones = _.map(_.semitones)
    it('get semitones of ascending intervals', function () {
      assert.deepEqual(semitones('1P 2M 3M 4P 5P 6M 7M'),
        [ 0, 2, 4, 5, 7, 9, 11 ])
    })
    it('get semitones of descending intervals', function () {
      assert.deepEqual(semitones('-1P -2M -3M -4P -5P -6M -7M'),
        [ -0, -2, -4, -5, -7, -9, -11 ])
    })
  })
})
