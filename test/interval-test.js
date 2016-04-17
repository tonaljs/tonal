/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')
var map = tonal.map
var parse = tonal.sci.parse

var log = (e) => { console.log(e); return e }

describe('intervals', function () {
  var interval = tonal.interval
  it('creates intervals', function () {
    assert.deepEqual(interval(0, 0, 0, 1), [ 0, 0, 1 ])
  })

  describe('simple', function () {
    it('get simple from a number', function () {
      var simples = map([tonal.simple])
      assert.deepEqual(simples('1 2 3 4 5 6 7 8 9 10 11 12 13 14 15'),
      [ 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0 ])
    })
    it('get simple from interval', function () {
      var simples = map([tonal.simple, tonal.ivl.parse])
      assert.deepEqual(simples('1P 2M 3M 4P 5P 6M 7M'),
      [ 0, 1, 2, 3, 4, 5, 6 ])
      assert.deepEqual(simples('8A 9A 10A 11A 12A 13A 14A'),
      [ 0, 1, 2, 3, 4, 5, 6 ])
      assert.deepEqual(simples('15d 16m 17m 18d 19d 20m 21m'),
      [ 0, 1, 2, 3, 4, 5, 6 ])
    })
  })

  describe('number', function () {
    var numbers = map([tonal.number, tonal.ivl.parse])
    it('get number from intervals', function () {
      assert.deepEqual(numbers('1P 3M 6m 9M 11P'),
      [1, 3, 6, 9, 11])
    })
  })

  describe('quality', function () {
    var qualities = map([tonal.quality, tonal.ivl.parse])
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

  describe('ivl.parse', function () {
    var parse = tonal.ivl.parse
    it('parses interval strings', function () {
      assert.deepEqual(parse('8A'), [ 7, -3, 1 ])
      assert.deepEqual(parse('-9m'), [ -5, 4, -1 ])
    })
  })

  describe('ivl.str', function () {
    var str = tonal.ivl.str
    it('get string from interval', function () {
      assert.equal(str([0, 1, 1]), '8P')
      assert.equal(str([7, -3, 1]), '8A')
    })
  })
})
