var vows = require('vows')
var assert = require('assert')
var Keykeyature = require('../key-signature')

vows.describe('Key keyature').addBatch({
  'by value': function () {
    var key = new Keykeyature(1)
    assert.equal(key.number, 1)
    assert.equal(key.major, 'G')
  },
  'by tonic': function () {
    var key = new Keykeyature('F')
    assert.equal(key.major, 'F')
    assert.equal(key.number, -1)
  },
  'alterations': function () {
    assert.equal(Keykeyature('Bb').alterations, 'bb')
    assert.equal(Keykeyature('Ab').alterations, 'bbbb')
    assert.equal(Keykeyature('D').alterations, '##')
    assert.equal(Keykeyature('E').alterations, '####')
  }
}).export(module)
