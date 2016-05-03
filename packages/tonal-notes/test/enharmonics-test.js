/* global describe it */
var assert = require('assert')
var note = require('..')

describe('tonal-note', function () {
  describe('enharmonics', function () {
    var enharmonics = note.enharmonics
    it('get enharmonics', function () {
      assert.deepEqual(enharmonics('C'), [ 'B#', 'C', 'Dbb' ])
      assert.deepEqual(enharmonics('B'), [ 'A##', 'B', 'Cb' ])
      assert.deepEqual(enharmonics('B#'), [ 'A###', 'B#', 'C' ])
      assert.deepEqual(enharmonics('F5'), [ 'E#5', 'F5', 'Gbb5' ])
      assert.deepEqual(enharmonics('E#2'), [ 'D###2', 'E#2', 'F2' ])
      assert.deepEqual(enharmonics('A###6'), [ 'G#####6', 'A###6', 'B#6' ])
      assert.deepEqual(enharmonics('A'), [ 'G##', 'A', 'Bbb' ])
      assert.deepEqual(enharmonics('Ab3'), [ 'G#3', 'Ab3', 'Bbbb3' ])
      assert.deepEqual(enharmonics('Db'), [ 'C#', 'Db', 'Ebbb' ])
    })
    it('returns empty array if not valid pitch', function () {
      assert.deepEqual(enharmonics('blah'), null)
    })
    it('with arrays', function () {
      var C = ['tnl', 0]
      assert.deepEqual(enharmonics(C),
        [ [ 'tnl', 12 ], [ 'tnl', 0 ], [ 'tnl', -12 ] ])
    })
  })
  describe('simplify', function () {
    it('simplify note', function () {
      assert.equal(note.simplify('E#2'), 'F2')
      assert.equal(note.simplify('B#2'), 'C3')
      assert.equal(note.simplify('Cb2'), 'B1')
      // strage case: not a COMPLETE simplification, but I think is enough
      assert.equal(note.simplify('A###6'), 'B#6')
    })
  })
})
