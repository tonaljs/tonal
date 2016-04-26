/* global describe it */
'use strict'

var assert = require('assert')
var _ = require('../')
var map = _.map

describe('array notation pitches - ', function () {
  describe('encode', function () {
    it('create pitch classes', function () {
      assert.deepEqual(_.encode(0, 0), ['tnl', 0])
      assert.deepEqual(_.encode(1, 0), ['tnl', 2])
      assert.deepEqual(_.encode(0, 1), ['tnl', 7])
      assert.deepEqual(_.encode(0, -1), ['tnl', -7])
    })
    it('create note pitches', function () {
      assert.deepEqual(_.encode(0, 0, 2), ['tnl', 0, 2])
      assert.deepEqual(_.encode(0, 1, 2), ['tnl', 7, -2])
      assert.deepEqual(_.encode(6, 1, 2), ['tnl', 12, -4])
    })
    it('creates intervals', function () {
      assert.deepEqual(_.encode(0, 0, 0, 1), ['tnl',  0, 0, 1 ])
    })
  })
  describe('parseNote', function () {
    it('parses notes', function () {
      assert.deepEqual(_.parseNote('C2'), ['tnl', 0, 2])
      assert.deepEqual(_.parseNote('C#2'), ['tnl', 7, -2])
      assert.deepEqual(_.parseNote('B#2'), ['tnl', 12, -4])
    })
    it('parse pitch classes', function () {
      var parseList = _.map(_.parseNote)
      assert.deepEqual(parseList('C D E F G A B'),
         [ ['tnl', 0 ], ['tnl', 2 ], ['tnl', 4 ], ['tnl', -1 ],
           ['tnl', 1 ], ['tnl', 3 ], ['tnl', 5 ] ])
    })
  })
  describe('isNoteStr', function () {
    var areNotes = _.map(_.isNoteStr)
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
