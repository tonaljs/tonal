var vows = require('vows')
var assert = require('assert')
var enharmonics = require('../lib/enharmonics')

vows.describe('enharmonics function').addBatch({
  'enharmonics without octave': function () {
    assert.deepEqual(enharmonics('C'), ['B#3', 'Dbb4'])
    assert.deepEqual(enharmonics('C#'), ['Db4', 'B##3'])
  },
  'enharmonics with octave': function () {
    assert.deepEqual(enharmonics('C2'), ['B#1', 'Dbb2'])
    assert.deepEqual(enharmonics('Db2'), ['C#2', 'B##1'])
    assert.deepEqual(enharmonics('C4'), ['B#3', 'Dbb4'])
    assert.deepEqual(enharmonics('C#4'), ['Db4', 'B##3'])
  },
  'with pitch class': function () {
    assert.deepEqual(enharmonics('Db3', 'C'), ['C#3'])
    assert.deepEqual(enharmonics('Db2', 'B'), ['B##1'])
    assert.deepEqual(enharmonics('Db5', 'E'), [])
    assert.deepEqual(enharmonics('Db', 'D'), ['Db4'])
  }
}).export(module)
