var vows = require('vows')
var assert = require('assert')
var enharmonics = require('../../lib/pitch/enharmonics')

vows.describe('pitch/enharmonics').addBatch({
  'get enharmonics': function () {
    assert.deepEqual(enharmonics('C'), [ 'A###3', 'B#3', 'Dbb4', 'Ebbbb4' ])
    assert.deepEqual(enharmonics('B'), [ 'G####4', 'A##4', 'Cb5', 'Dbbb5' ])
    assert.deepEqual(enharmonics('F5'), [ 'D###5', 'E#5', 'Gbb5', 'Abbbb5' ])
    assert.deepEqual(enharmonics('E#2'), [ 'D###2', 'F2', 'Gbb2', 'Abbbb2' ])
    assert.deepEqual(enharmonics('A###6'), [ 'B#6', 'C7', 'Dbb7', 'Ebbbb7' ])
    assert.deepEqual(enharmonics('A'), [ 'F####4', 'G##4', 'Bbb4', 'Cbbb5' ])
    assert.deepEqual(enharmonics('Ab3'), ['E####3', 'F###3', 'G#3', 'Bbbb3', 'Cbbbb4'])
  },
  'include pitch': function () {
    assert.deepEqual(enharmonics('C4', true), [ 'A###3', 'B#3', 'C4', 'Dbb4', 'Ebbbb4' ])
  }
}).export(module)
