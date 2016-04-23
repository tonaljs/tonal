/* global describe it */
'use strict'

var assert = require('assert')
var tnl = require('../')
var map = tnl.map

describe('array notation pitches - ', function () {
  describe('pitch', function () {
    var pitch = tnl.pitch
    it('create pitch classes', function () {
      assert.deepEqual(pitch(0, 0), [0])
      assert.deepEqual(pitch(1, 0), [2])
      assert.deepEqual(pitch(0, 1), [7])
      assert.deepEqual(pitch(0, -1), [-7])
    })
    it('create note pitches', function () {
      assert.deepEqual(pitch(0, 0, 2), [0, 2])
      assert.deepEqual(pitch(0, 1, 2), [7, -2])
      assert.deepEqual(pitch(6, 1, 2), [12, -4])
    })
    it('creates intervals', function () {
      assert.deepEqual(pitch(0, 0, 0, 1), [ 0, 0, 1 ])
    })
  })
  describe('parseNote', function () {
    var parse = tnl.parseNote
    it('parses notes', function () {
      assert.deepEqual(parse('C2'), [0, 2])
      assert.deepEqual(parse('C#2'), [7, -2])
      assert.deepEqual(parse('B#2'), [12, -4])
    })
    it('parse pitch classes', function () {
      assert.deepEqual(tnl.listArr('C D E F G A B').map(parse),
         [ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ])
    })
  })
  describe('parseIvl', function () {
    var parse = tnl.parseIvl
    it('parses ascending intervals', function () {
      assert.deepEqual(parse('8A'), [7, -3, 1])
      assert.deepEqual(parse('9m'), [-5, 4, 1])
    })
    it('parses descending intervals', function () {
      assert.deepEqual(parse('-8A'), [-7, 3, -1])
      assert.deepEqual(parse('-9m'), [5, -4, -1])
    })
  })
  describe('strNote', function () {
    var str = tnl.strNote
    it('build pitch classes', function () {
      assert.equal(str([-7]), 'Cb')
    })
    it('build pitch notes', function () {
      assert.equal(str([7, -4]), 'C#0')
    })
  })
  describe('strIvl', function () {
    var str = tnl.strIvl
    it('build intervals', function () {
      assert.deepEqual(str([7, -3, 1]), '8A')
      assert.deepEqual(str([-7, 3, -1]), '-8A')
    })
  })
})
