/* global describe it */
var assert = require('assert')
var enharmonics = require('..')

describe('note.enharmonics', function () {
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
  it('with arrays', function () {
    // pitch classes: C
    assert.deepEqual(enharmonics([0], true),
      [ [ 12 ], [ 0 ], [ -12 ] ])
    // note: C2
    assert.deepEqual(enharmonics([0, 2, null], true),
      [ [ 12, -5, null ], [ 0, 2, null ], [ -12, 9, null ] ])
    // note with duration: C2/4
    assert.deepEqual(enharmonics([0, 2, 4], true),
      [ [ 12, -5, 4 ], [ 0, 2, 4 ], [ -12, 9, 4 ] ])
  })
  it('simplify', function () {
    assert.equal(enharmonics.simplify('E#2'), 'F2')
    assert.equal(enharmonics.simplify('B#2'), 'C3')
    assert.equal(enharmonics.simplify('Cb2'), 'B1')
    // strage case: not a COMPLETE simplification, but I think is enough
    assert.equal(enharmonics.simplify('A###6'), 'B#6')
  })
})
