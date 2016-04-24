/* global describe it */
'use strict'

var assert = require('assert')
var tonal = require('../')
var map = tonal.map

describe('array notation pitches - ', function () {
  describe('pitch', function () {
    var pitch = tonal.pitch
    it('create pitch classes', function () {
      assert.deepEqual(pitch(0, 0), ['tnl', 0])
      assert.deepEqual(pitch(1, 0), ['tnl', 2])
      assert.deepEqual(pitch(0, 1), ['tnl', 7])
      assert.deepEqual(pitch(0, -1), ['tnl', -7])
    })
    it('create note pitches', function () {
      assert.deepEqual(pitch(0, 0, 2), ['tnl', 0, 2])
      assert.deepEqual(pitch(0, 1, 2), ['tnl', 7, -2])
      assert.deepEqual(pitch(6, 1, 2), ['tnl', 12, -4])
    })
    it('creates intervals', function () {
      assert.deepEqual(pitch(0, 0, 0, 1), ['tnl',  0, 0, 1 ])
    })
  })
  describe('parseNote', function () {
    var parse = tonal.parseNote
    it('parses notes', function () {
      assert.deepEqual(parse('C2'), ['tnl', 0, 2])
      assert.deepEqual(parse('C#2'), ['tnl', 7, -2])
      assert.deepEqual(parse('B#2'), ['tnl', 12, -4])
    })
    it('parse pitch classes', function () {
      assert.deepEqual(tonal.listArr('C D E F G A B').map(parse),
         [ ['tnl', 0 ], ['tnl', 2 ], ['tnl', 4 ], ['tnl', -1 ],
           ['tnl', 1 ], ['tnl', 3 ], ['tnl', 5 ] ])
    })
  })
  describe('isNoteStr', function () {
    function areNotes(l) { return tonal.listArr(l).map(tonal.isNoteStr) }
    it('checks if valid note', function () {
      assert.deepEqual(areNotes('c c#2 blah 3M m-3 12'),
        [ true, true, false, false, false, false ])
    })
  })
  describe('parseIvl', function () {
    var parse = tonal.parseIvl
    it('parses ascending intervals', function () {
      assert.deepEqual(parse('8A'), ['tnl', 7, -3, 1])
      assert.deepEqual(parse('9m'), ['tnl', -5, 4, 1])
    })
    it('parses descending intervals', function () {
      assert.deepEqual(parse('-8A'), ['tnl', -7, 3, -1])
      assert.deepEqual(parse('-9m'), ['tnl', 5, -4, -1])
    })
  })
  describe('strNote', function () {
    var str = tonal.strNote
    it('build pitch classes', function () {
      assert.equal(str(['tnl', -7]), 'Cb')
    })
    it('build pitch notes', function () {
      assert.equal(str(['tnl', 7, -4]), 'C#0')
    })
  })
  describe('strIvl', function () {
    var str = tonal.strIvl
    it('build intervals', function () {
      assert.deepEqual(str(['tnl', 7, -3, 1]), '8A')
      assert.deepEqual(str(['tnl', -7, 3, -1]), '-8A')
    })
  })
})
