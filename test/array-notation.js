/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')
var map = _.map

describe('array notation pitches - ', function () {
  describe('pitchClass', function () {
    it('create pitch classes', function () {
      assert.deepEqual(_.pitchClass(0, 0), ['tnl', 0])
      assert.deepEqual(_.pitchClass(1, 0), ['tnl', 2])
      assert.deepEqual(_.pitchClass(0, 1), ['tnl', 7])
      assert.deepEqual(_.pitchClass(0, -1), ['tnl', -7])
    })
  })
  describe('notePitch', function () {
    it('create note pitches', function () {
      assert.deepEqual(_.notePitch(0, 0, 2), ['tnl', 0, 2])
      assert.deepEqual(_.notePitch(0, 1, 2), ['tnl', 7, -2])
      assert.deepEqual(_.notePitch(6, 1, 2), ['tnl', 12, -4])
    })
  })
  describe('interval', function () {
    it('creates intervals', function () {
      assert.deepEqual(_.interval(0, 0, 0, 1), ['tnl',  0, 0, 1 ])
    })
  })
  describe('parseNote', function () {
    var parse = _.parseNote
    it('parses notes', function () {
      assert.deepEqual(parse('C2'), ['tnl', 0, 2])
      assert.deepEqual(parse('C#2'), ['tnl', 7, -2])
      assert.deepEqual(parse('B#2'), ['tnl', 12, -4])
    })
    it('parse pitch classes', function () {
      assert.deepEqual(_.listArr('C D E F G A B').map(parse),
         [ ['tnl', 0 ], ['tnl', 2 ], ['tnl', 4 ], ['tnl', -1 ],
           ['tnl', 1 ], ['tnl', 3 ], ['tnl', 5 ] ])
    })
  })
  describe('isNoteStr', function () {
    function areNotes(l) { return _.listArr(l).map(_.isNoteStr) }
    it('checks if valid note', function () {
      assert.deepEqual(areNotes('c c#2 blah 3M m-3 12'),
        [ true, true, false, false, false, false ])
    })
  })
  describe('parseIvl', function () {
    var parse = _.parseIvl
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
    var str = _.strNote
    it('build pitch classes', function () {
      assert.equal(str(['tnl', -7]), 'Cb')
    })
    it('build pitch notes', function () {
      assert.equal(str(['tnl', 7, -4]), 'C#0')
    })
  })
  describe('strIvl', function () {
    var str = _.strIvl
    it('build intervals', function () {
      assert.deepEqual(str(['tnl', 7, -3, 1]), '8A')
      assert.deepEqual(str(['tnl', -7, 3, -1]), '-8A')
    })
  })
})
