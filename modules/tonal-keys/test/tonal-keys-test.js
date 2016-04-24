/* global describe it */
var assert = require('assert')
var key = require('..')

function map (fn, str) { return str.split(' ').map(fn) }

describe('music-key', function () {
  describe('relative', function () {
    it('get relatives', function () {
      assert.deepEqual(key.relative('major', 'D minor'),
        { name: 'F major', tonic: 'F', mode: 'major' })
      assert.deepEqual(key.relative('lydian', 'Eb dorian'),
        { name: 'Gb lydian', tonic: 'Gb', mode: 'lydian' })
    })
  })
  describe('accidentals', function () {
    it('get sharps', function () {
      assert.equal(key.accidentals('C major'), '')
      assert.equal(key.accidentals('A major'), '')
    })
  })
  describe('key', function () {
    it('create keys from properties', function () {
      assert.deepEqual(key.build('c', 'major'),
        { name: 'C major', tonic: 'C', mode: 'major' })
      assert.deepEqual(key.build('fx', 'mixolydian'),
        { name: 'F## mixolydian', tonic: 'F##', mode: 'mixolydian' })
    })
    it('tonic is always a pitch class', function () {
      assert.deepEqual(key.build('bb3', 'aeolian'),
        { name: 'Bb aeolian', tonic: 'Bb', mode: 'aeolian' })
    })
    it('tonic is optional', function () {
      assert.deepEqual(key.build(null, 'lydian'),
        { name: null, tonic: false, mode: 'lydian' })
    })
  })
  describe('isKey', function () {
    it('detect keys', function () {
      const k = key.build('C', 'major')
      assert.equal(key.isKey(k), true)
    })
  })
  describe('fromAlter', function () {
    function alters(a) { return key.fromAlter(a).name }
    it('create keys from alterations', function () {
      assert.deepEqual(map(alters, '0 1 2 3 4 5 6 7'),
        [ 'C major', 'G major', 'D major', 'A major', 'E major',
          'B major', 'F# major', 'C# major' ])
      assert.deepEqual(map(alters, '0 -1 -2 -3 -4 -5 -6 -7'),
        [ 'C major', 'F major', 'Bb major', 'Eb major', 'Ab major',
          'Db major', 'Gb major', 'Cb major' ])
    })
  })
  describe('fromAcc', function () {
    it('creates keys from accidentals', function () {
      assert.deepEqual(key.fromAcc('###'),
        { name: 'A major', tonic: 'A', mode: 'major' })
      assert.deepEqual(key.fromAcc('bbb'),
        { name: 'Eb major', tonic: 'Eb', mode: 'major' })
    })
  })
  describe('fromName', function () {
    it('creates a key from name', function () {
      assert.deepEqual(key.fromName('fx dorian'),
        { name: 'F## dorian', tonic: 'F##', mode: 'dorian' })
    })
    it('creates a key without tonic', function () {
      assert.deepEqual(key.fromName('phrygian'),
        { name: null, tonic: false, mode: 'phrygian' })
    })
    it('creates key without mode (default major)', function () {
      assert.deepEqual(key.fromName('D4'),
        { name: 'D major', tonic: 'D', mode: 'major' })
    })
  })
  describe('asKey', function () {
    var k = key.build('G', 'major')
    it('bypass keys', function () {
      assert(key.asKey(k) === k)
    })
    it('parse names', function () {
      assert.deepEqual(key.asKey('g major'), k)
    })
    it('parse accidentals', function () {
      assert.deepEqual(key.asKey('#'), k)
    })
    it('from alteration', function () {
      assert.deepEqual(key.asKey(1), k)
    })
  })
})
