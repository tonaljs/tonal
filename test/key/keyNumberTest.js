var vows = require('vows')
var assert = require('assert')
var keyNumber = require('../../lib/key/keyNumber')

vows.describe('key/keyNumber').addBatch({
  'major with sharps': function () {
    assert.deepEqual(keyNumber('C major'), 0)
    assert.deepEqual(keyNumber('C'), 0)
    assert.deepEqual(keyNumber('g major'), 1)
    assert.deepEqual(keyNumber('g#'), 8)
  },
  'major with flats': function () {
    assert.deepEqual(keyNumber('F major'), -1)
    assert.deepEqual(keyNumber('bb major'), -2)
    assert.deepEqual(keyNumber('eb major'), -3)
  },
  'minor with sharps': function () {
    assert.deepEqual(keyNumber('A minor'), 0)
    assert.deepEqual(keyNumber('E minor'), 1)
  },
  'minor with flats': function () {
    assert.deepEqual(keyNumber('D minor'), -1)
    assert.deepEqual(keyNumber('G minor'), -2)
    assert.deepEqual(keyNumber('Eb minor'), -6)
  },
  'numbers': function () {
    assert.deepEqual(keyNumber(-1), -1)
  },
  'accidentals': function () {
    assert.deepEqual(keyNumber('###'), 3)
    assert.deepEqual(keyNumber('Bb'), -2)
    assert.deepEqual(keyNumber('bb'), -2)
    assert.deepEqual(keyNumber('bbb'), -3)
  },
  'invalid': function () {
    assert.equal(keyNumber('C bla'), null)
    assert.equal(keyNumber('D dorian'), null)
  }
}).export(module)
