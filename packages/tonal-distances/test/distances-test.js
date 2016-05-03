/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')
function map (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

describe('distances', function () {
  describe('interval', function () {
    it('get distance between notes', function () {
      var fromC3 = map(_.dist('C3'))
      assert.deepEqual(fromC3('C3 e3 e4 c2 e2'),
        [ '1P', '3M', '10M', '-8P', '-6m' ])
    })
    it('distances between pitch classes are always ascending', function () {
      assert.deepEqual(_.dist('C', 'D'), '2M')
      var fromC = map(_.dist('C'))
      assert.deepEqual(fromC('c d e f g a b'),
        [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
      var fromG = map(_.dist('G'))
      assert.deepEqual(fromG('c d e f g a b'),
        [ '4P', '5P', '6M', '7m', '1P', '2M', '3M' ])
    })
    it('get difference between intervals', function () {
      var subsM2 = map(_.dist('M2'))
      assert.deepEqual(subsM2('P1 M2 M3 P4 P5 M6 M7'),
        [ '-2M', '1P', '2M', '3m', '4P', '5P', '6M' ])
    })
    it('pitch types can not be mixed', function () {
      assert.equal(_.dist('C', 'C2'), null)
      assert.equal(_.dist('C2', 'C'), null)
    })
    it('when both pitches are in arra format, return array format', function () {
      assert.deepEqual(_.dist(['tnl', 0, 0], ['tnl', 1, 0]),
        [ 'tnl', 1, 0, 1 ])
    })
    it('when one pitch in array format, return string', function () {
      assert.deepEqual(_.dist(['tnl', 0], 'D'), '2M')
    })
  })
  describe('transpose', function () {
    it('order of params is not relevant', function () {
      assert.equal(_.tr('c#2', 'm3'), _.tr('m3', 'c#2'))
    })
    it('notes by intervals', function () {
      assert.deepEqual(map(_.tr('3M'), 'c2 d3 f4 g5'),
        [ 'E2', 'F#3', 'A4', 'B5' ])
    })
    it('notes by descending intervals', function () {
      assert.deepEqual(map(_.tr('-2M'), 'c2 d3 f4 g5'),
        [ 'Bb1', 'C3', 'Eb4', 'F5' ])
    })
    it('intervals by intervals', function () {
      assert.deepEqual(map(_.tr('3M'), '1P 2M 3M 4P 5P'),
        [ '3M', '4A', '5A', '6M', '7M' ])
    })
    it('descending intervals', function () {
      assert.deepEqual(map(_.tr('-2M'), '1P 2M 3M 4P 5P'),
        [ '-2M', '1P', '2M', '3m', '4P' ])
    })
    it('all desending intervals', function () {
      assert.deepEqual(map(_.tr('-2M'), '-5P -4P -3M -2M 1P'),
        ['-6M', '-5P', '-4A', '-3M', '-2M'])
    })
    it('returns array notation if both params are in array notation', function () {
      assert.deepEqual(_.tr(['tnl', 1, 0, 1], ['tnl', 1, 0]),
        [ 'tnl', 2, 0 ])
    })
  })
})
