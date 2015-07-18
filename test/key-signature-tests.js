var vows = require('vows')
var assert = require('assert')
var KeySignature = require('../key-signature')

vows.describe('Key keyature').addBatch({
  'by value': function () {
    var key = new KeySignature(1)
    assert.equal(key.number, 1)
    assert.equal(key.major, 'G')
    assert.equal(key.minor, 'E')
  },
  'F by tonic': function () {
    var key = new KeySignature('F')
    assert.equal(key.major, 'F')
    assert.equal(key.minor, 'D')
    assert.equal(key.number, -1)
  },
  'A#': function () {
    var key = new KeySignature('A#')
    assert.equal(key.number, 10)
    assert.equal(key.minor, 'G')
  },
  'alterations': function () {
    assert.equal(KeySignature('Bb').alterations, 'bb')
    assert.equal(KeySignature('Ab').alterations, 'bbbb')
    assert.equal(KeySignature('D').alterations, '##')
    assert.equal(KeySignature('E').alterations, '####')
  }
}).export(module)
