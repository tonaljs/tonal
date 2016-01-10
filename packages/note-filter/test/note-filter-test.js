/* global describe it */
var assert = require('assert')
var filter = require('..')

describe('note-filter', function () {
  it('filter notes by one pitch class', function () {
    assert.deepEqual(filter('c', 'c3 c#2 c2 c4 cb2'), ['C3', 'C2', 'C4'])
  })

  it('filter notes by a pitch class list', function () {
    assert.deepEqual(filter('C E G', 'c2 db2 d2 eb2 gb2 g3 ab g4'), [ 'C2', 'G3', 'G4' ])
  })

  it('filter enharmonics', function () {
    assert.deepEqual(filter('C', 'C2 B#3 Dbb3'), [ 'C2', 'C4', 'C3' ])
  })
})
