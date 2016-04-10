/* global describe it */
var assert = require('assert')
var gamut = require('..')

describe('music-gamut', function () {
  describe('transform function', function () {
    var transform = gamut.transform
    it('parse gamut if function is null', function () {
      assert.deepEqual(transform(null, 'c fx d3 blah 5'),
        [ 'C', 'F##', 'D3', null, '5P' ])
    })
    it('split gamut if function is false', function () {
      var split = gamut.split
      assert.deepEqual(split('W |   X    Y  ,  Z '), ['W', 'X', 'Y', 'Z'])
      assert.deepEqual(split('  A '), ['A'])
      assert.deepEqual(split(['A', 'b']), ['A', 'b'])
      assert.deepEqual(split(32), [ 32 ])
      assert.deepEqual(split(), [])
      assert.deepEqual(split(null), [])
    })
    it('transform function can return a value', function () {
      var len = transform(function (g) { return g.length })
      assert.equal(len('A B C'), 3)
    })
    it('if transform function return notes in array notation, they are converted to strings', function () {
      assert.deepEqual(transform(function (gamut) {
        return gamut.map(function (arr) { return [arr[0] + 1] })
      }, 'c d e f g'), ['G', 'A', 'B', 'C', 'D'])
    })
    it('if transform funtcion return a simple array, its not converted', function () {
      var fifths = transform(function (g) { return g.map(function (n) { return n[0] }) })
      assert.deepEqual(fifths('C D E'), [0, 2, 4])
    })
  })
  describe('map', function () {
    it('map pitches in array notation', function () {
      var octUp = gamut.map(function (n) { return [n[0], n[1] + 1, n[2]] })
      assert.deepEqual(octUp('c2 d3 e4'), [ 'C3', 'D4', 'E5' ])
    })
  })

  describe('reduce', function () {
    it('can reduce a gamut', function () {
      var maxNote = function (a, b) {
        return (a[0] * 7 + a[1] * 12 >= b[0] * 7 + b[1] * 12) ? a : b
      }
      var max = gamut.reduce(function (acc, note) { return maxNote(acc, note) }, [0, 0])
      // TODO: reduce should convert values back to strings
      assert.deepEqual(max('c2 d5 f3 g#6 d2'), [8, 2, null])
    })
  })

  describe('filter', function () {
    it('the function receives notes in array notation', function () {
      var onlyC = gamut.filter(function (p) { return p[0] === 0 })
      assert.deepEqual(onlyC('c2 d3 c4 f6 c7'), ['C2', 'C4', 'C7'])
    })
  })

  describe('rotate', function () {
    it('rotate arrays', function () {
      assert.deepEqual(gamut.rotate(0, 'C D E'), ['C', 'D', 'E'])
      assert.deepEqual(gamut.rotate(1, 'C D E'), ['D', 'E', 'C'])
      assert.deepEqual(gamut.rotate(4, 'C D E'), ['D', 'E', 'C'])
      assert.deepEqual(gamut.rotate(-1, 'C D E'), ['E', 'C', 'D'])
      assert.deepEqual(gamut.rotate(-2, 'C D E'), ['D', 'E', 'C'])
      assert.deepEqual(gamut.rotate(-5, 'C D E'), ['D', 'E', 'C'])
    })
  })
  describe('select', function () {
    it('select elements', function () {
      assert.deepEqual(gamut.select('1 3 5', 'C D E f g a b'), ['C', 'E', 'g'])
    })
    it('is currified', function () {
      assert.deepEqual(gamut.select('1 3 5')('C D E f g a b'), ['C', 'E', 'g'])
    })
  })
})
